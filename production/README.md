# 构建生产环境
这一节主要是使用工具将网站或者应用程序构建到生产环境中, 代码延用 [tree-shaking](https://github.com/Caraws/webpack-demo/tree/master/tree-shaking)

## 关于配置
由于在开发环境和生成环境的构建目标之间有很大的差距. 在开发环境下我们更注重热替换或重载能力的 source map 和本地的 web server; 而生产环境下我们关注点将放在更小的 bundle/ 更轻量的 source map 以及优化资源以改善加载时间. 于是通常都是**为不同的环境配置独立的 webpack 配置**

按以上思路为每个环境配置的话, 本着不想写重复的代码, 所以还会保留一个通用配置, 这样就只需要把每个环境的特定配置指出就好. 由于分离了配置就避免不了要把通用配置合并到每个环境啊, 于是引入 [webpack-merge](https://github.com/survivejs/webpack-merge) 工具.

那就开始分离之前的代码试试吧, 当然还是先安装 `webpack-merge`:
```zsh
npm install --save-dev webpack-merge
```

目录结构也要变一下:
```shell
  production
  |- package.json
- |- webpack.config.js
+ |- webpack.common.js
+ |- webpack.dev.js
+ |- webpack.prod.js
  |- /dist
  |- /src
    |- index.js
    |- math.js
  |- /node_modules
```

先写通用部分的配置: 先装一下👇两个插件 , webpack.common.js
```js
const path = require('path')
// 每次构建清除旧文件, 重新生成
const CleanWebpackPlugin = require('clean-webpack-plugin')
// 动态创建 html 文件
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: {
        app: './src/index.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'Production'
        })
    ]
}
```

开发环境配置: 自己装下 `webpack-dev-server`, webpack.dev.js
```js
const merge =  require('webpack-merge')
const common = require('./webpack.common')

module.exports = merge(common, {
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist'
    }
})
```

生产环境配置: webpack.prod.js
```js
const merge = require('webpack-merge')
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin')
const common = require('./webpack.common')

module.exports = merge(common, {
    plugins: [
        new UglifyjsWebpackPlugin()
    ]
})
```

配置 NPM Scripts: package.json
```json
{
    // ...
    "scripts": {
        "start": "webpack-dev-server --open --config webpack.dev.js",
        "build": "webpack --config webpack.prod.js"
    }
}
```
跑一下 `npm start` 和 `npm run build` 应该是和之前效果一样.

### source map
官方还是推荐在生产环境中使用 source map, 在基准测试中 debug 很有帮助(讲道理正式生产环境下, 我觉得还是别用太耗资源了). 不过跟生产环境下的 `inline-source-map` 不同, 用的是`source-map` 选项, 其他的选择请看 [devtool](https://doc.webpack-china.org/configuration/devtool).

> 避免在生产中使用 `inline-xxx` 和 `eval-xxx`, 因为它们会增加 bundle 的大小, 并降低整体性能.

webpack.prod.js
```js
// ...
module.exports = merge(common, {
    devtool: 'source-map',
    plugins: [
        new UglifyjsWebpackPlugin({
            sourceMap: true
        })
    ]
})
```
再次构建就能看到 `dist` 文件夹下多了以 `.map` 为后缀的文件.

### 指定环境
有许多的 library 是通过关联 `process.env.NODE_ENV`(由 Node.js 暴露给脚本执行的环境变量)环境变量来决定 library 中要引用哪些内容. 比如在开发环境, 某些 library 可能会添加一些 log/控制台的警告或者测试; 在生产环境下(process.env.NODE_ENV === 'production'), library 可能就会删除或者添加一些代码. webpack 内置的 [DefaultPlugin](https://doc.webpack-china.org/plugins/define-plugin) 可以为所有依赖定义这个变量.

webpack.prod.js
```js
// ...
module.exports = merge(common, {
    plugins: [
        new webpack.DefaultPlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ]
})
```

还有一点是, 在 `src` 文件下的本地代码都可以关联到 `process.env.NODE_ENV` 环境变量. 比如这样:

src/index.js
```js
// ...
if (process.env.NODE_ENV !== 'production') {
    console.log('这是开发环境!')
} else {
    console.log('这是生产环境!')
}
// ...
```

分别执行 `npm start` 和 `npm run build` 就可以看到控制台输出的内容根据环境而变化.

## CSS 分离
在之前的 [资源管理](https://github.com/Caraws/webpack-demo/tree/master/asset) 中, 我们再 `src/index.js` 引入了 `src/index.css` 在构建之后 CSS 其实是被内嵌在 bundle 中的. 这样在生产环境下会延长加载时间, 所以最好还是将 CSS 分离为单独的 CSS 文件, [extract-text-webpack-plugin](https://doc.webpack-china.org/plugins/extract-text-webpack-plugin) 就可以用来分离 CSS.

安装
```zsh
npm install --save-dev extract-text-webpack-plugin
```

在 `src/` 文件下新建一个 `index.css`

index.css
```css
pre {
    color: red;
}
```

webpack.dev.js
```js
// ...
module.exports = {
    // ...
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
}
```

webpack.prod.js
```js
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
// ...

module.exports = merge(common, {
    plugins: [
        // ...
        // 分离出来的 css 文件名变为 style.css
        new ExtractTextWebpackPlugin('style.css')
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextWebpackPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            }
        ]
    }
})
```

可以先 `npm start` 看看 `style-loader` 和 `css-loader` 有没有用上, 一切正常的话 `npm run build` 在 `dist` 文件夹下你就能看到被分离出来的 css 文件了.

前往下一节 [代码分离](https://github.com/Caraws/webpack-demo/tree/master/code-split)

Created on 2017-1-24 by cara
