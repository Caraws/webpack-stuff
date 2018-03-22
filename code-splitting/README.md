# 代码分离
将代码分离到不同的 bundle 中, 然后可以按需加载或并行加载这些文件. 这样可以获取更小的 bundle 以及控制资源加载的优先级,
合理使用能够优化加载时间.

有三种常用的代码分离方法:
- 入口: 使用 entry 手动配置分离代码
- 防止重复: 使用 `CommonsChunkPlugin` 去重和分离代码
- 动态导入: 通过模块的内联函数调用来分离代码

### 入口
从入口配置分离代码, 这种方式手动配置较多而且会有一些陷阱. 先来看看怎么从 main bundle 中分离另一个模块:

webpack-demo/code-splitting
```shell
|- package.json
|- webpack.config.js
|- /dist
|- /src
  |- index.js
+ |- another-module.js
|- /node_modules
```

src/index.js
```js
import _ from 'lodash'

const component = () => {
    let element = document.createElement('div')
    element.innerHTML = _.join(['Hello', 'webpack'], ' ')

    return element
}
document.body.appendChild(component())
```

src/another-module.js
```js
// 跟 index.js 重复引用 lodash
import _ from 'lodash'

console.log(_.join(['another', 'module', 'loaded!'], ' '))
```

这里要安装一下 `html-webpack-plugin` ,webpack.config.js
```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
    entry: {
        app: './src/index.js',
        another: './src/another-module.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Code Splitting'
        }),
        new CleanWebpackPlugin(['dist'])
    ]
}
```

package.json
```json
// ...
"scripts": {
    "build": "webpack"
}
// ...
```
运行 `npm run build`, 将看见如下构建结果:

```shell
➜  code-splitting git:(master) ✗ npm run build

> code-splitting@1.0.0 build /Users/cara/workspace/project/webpack-demo/code-splitting
> webpack

Hash: 68d023e8fec09a379852
Version: webpack 3.11.0
Time: 803ms
            Asset       Size  Chunks                    Chunk Names
    app.bundle.js     544 kB       0  [emitted]  [big]  app
another.bundle.js     544 kB       1  [emitted]  [big]  another
       index.html  253 bytes          [emitted]
   [1] (webpack)/buildin/global.js 509 bytes {0} {1} [built]
   [2] (webpack)/buildin/module.js 517 bytes {0} {1} [built]
   [3] ./src/index.js 216 bytes {0} [built]
   [4] ./src/another-module.js 82 bytes {1} [built]
    + 1 hidden module
Child html-webpack-plugin for "index.html":
     1 asset
       [2] (webpack)/buildin/global.js 509 bytes {0} [built]
       [3] (webpack)/buildin/module.js 517 bytes {0} [built]
        + 2 hidden modules
```
这种方法存在的问题是:
- 如果入口 chunks 之间有重复的模块, 重复的模块都会被打包到各个 bundle 中
- 这种方式不够灵活, 不能将核心应用程序逻辑进行动态拆分

以上两点中, 第一点在实例中能够明显的体现出来. 因为在 index.js 和 another-module.js 中都引用了 lodash,
这样就造成了重复引用, 导致 app.bundle.js 和 another.bundle.js 都包含了 lodash 有544 kb, 所以使用 `CommonsChunkPlugin` 来解决重复引用的问题.

### 防止重复引用
[CommonsChunkPlugin](https://doc.webpack-china.org/plugins/commons-chunk-plugin) 可以将公共的依赖项
提取到已有的 chunk 中, 或者重新生成一个 chunk.

webpack.config.js
```js
// ...
const webpack = require('webpack')

module.exports = {
    // ...
    plugins: [
        // ...
        new webpack.optimize.CommonsChunkPlugin({
            // 指定公共模块的名称
            name: 'common'
        })
    ]
}
```

执行 `npm run build`, 看下构建结果:
```shell
➜  code-splitting git:(master) ✗ npm run build

> code-splitting@1.0.0 build /Users/cara/workspace/project/webpack-demo/code-splitting
> webpack

Hash: b9cf7ac35434ca40bfaf
Version: webpack 3.11.0
Time: 746ms
            Asset       Size  Chunks                    Chunk Names
    app.bundle.js  672 bytes       0  [emitted]         app
another.bundle.js  532 bytes       1  [emitted]         another
 common.bundle.js     545 kB       2  [emitted]  [big]  common
       index.html  316 bytes          [emitted]
   [1] ./src/index.js 216 bytes {0} [built]
   [2] (webpack)/buildin/global.js 509 bytes {2} [built]
   [3] (webpack)/buildin/module.js 517 bytes {2} [built]
   [4] ./src/another-module.js 82 bytes {1} [built]
    + 1 hidden module
Child html-webpack-plugin for "index.html":
     1 asset
       [2] (webpack)/buildin/global.js 509 bytes {0} [built]
       [3] (webpack)/buildin/module.js 517 bytes {0} [built]
        + 2 hidden modules
``` 

可以看到使用 `CommonsChunkPlugin` 之后, 公共部分被单独分到了 common.bundle.js 中, 并将其从 main bundle 中
移除, 减小体积. `CommonsChunkPlugin` 还可以显式地从应用程序代码中分离 vendor 模块:

webpack.config.js
```js
// ...
module.exports = {
    entry: {
        app: './src/index.js',
        another: './src/another-module.js',
        vendor: ['lodash']
    },
    // ...
    plugins: [
        // ...
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            // 随着模块越来越多, 这个配置可以保证没有其他模块
            // 会打包进 vendor chunk
            minChunks: Infinity
        })
    ]
}
```
构建结果为: 
```shell
➜  code-splitting git:(master) ✗ npm run build

> code-splitting@1.0.0 build /Users/cara/workspace/project/webpack-demo/code-splitting
> webpack

clean-webpack-plugin: /Users/cara/workspace/project/webpack-demo/code-splitting/dist has been removed.
Hash: e3305b1bc22d4f61417f
Version: webpack 3.11.0
Time: 819ms
            Asset       Size  Chunks                    Chunk Names
    app.bundle.js  672 bytes       0  [emitted]         app
another.bundle.js  532 bytes       1  [emitted]         another
 vendor.bundle.js     545 kB       2  [emitted]  [big]  vendor
       index.html  316 bytes          [emitted]
   [1] ./src/index.js 216 bytes {0} [built]
   [2] (webpack)/buildin/global.js 509 bytes {2} [built]
   [3] (webpack)/buildin/module.js 517 bytes {2} [built]
   [4] ./src/another-module.js 82 bytes {1} [built]
   [5] multi lodash 28 bytes {2} [built]
    + 1 hidden module
Child html-webpack-plugin for "index.html":
     1 asset
       [2] (webpack)/buildin/global.js 509 bytes {0} [built]
       [3] (webpack)/buildin/module.js 517 bytes {0} [built]
        + 2 hidden modules
```
这样公共的 lodash 就被显式的分离到了 vendor.bundle.js 中.

### 动态导入
涉及到动态拆分代码时, webpack 提供了两个类似的技术. 第一种, 是符合 ECMAScript 提案的 `import()` 语法, 也是优先选择的方式; 第二种, 是 webpack 特定的 [require.ensure](https://doc.webpack-china.org/api/module-methods#require-ensure).

> `import()` 调用会在内部使用 promises, 所以如果在旧版本浏览器中使用 `import()`, 记得使用 polyfill 库

先尝试使用第一种方法, 开始之前要先移除配置中多余的 entry 和 CommsChunkPlugin:

webpack.config.js
```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: {
        app: './src/index.js'
    },
    output: {
        filename: '[name].bundle.js',
        // chunckFilename 决定非入口 chunk 的名称
        chunkFilename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins [
        new HtmlWebpackPlugin({
            title: 'Code Splitting'
        }),
        new CleanWebpackPlugin(['dist'])
    ]
}
```

现在开始改造, 我们不再使用静态导入 lodash, 通过动态导入来分离一个 chunk:

src/index.js
```js
const getComponent = _ => {
    
    return import(/* webpackChunkName: 'lodash' */ 'lodash').then(_ => {
        let element = document.createEelement('div')
        element.innerHTML = _.join(['Hello', 'webpack'], ' ')
        return element
    }).catch(err => 'An error occurred while loading the component')
}
getComponent().then(component => {
    document.body.appendChild(component)
})
```
注释中使用 `webpackChunkName` 会让 lodash 被命名为 lodash.bundle.js, 而不是 [id].bundle.js,
关于 `webpackChunkName` 和其他选项请查看 [import() 相关文档](https://doc.webpack-china.org/api/module-methods#import-). 

然后 `npm run build`, 查看 lodash 是否会分离到一个单独的 bundle:
```shell
➜  code-splitting git:(master) ✗ npm run build

> code-splitting@1.0.0 build /Users/cara/workspace/project/webpack-demo/code-splitting
> webpack

clean-webpack-plugin: /Users/cara/workspace/project/webpack-demo/code-splitting/dist has been removed.
Hash: 51f10b2200b13f7cc3ad
Version: webpack 3.11.0
Time: 821ms
           Asset       Size  Chunks                    Chunk Names
lodash.bundle.js     541 kB       0  [emitted]  [big]  lodash
   app.bundle.js    6.42 kB       1  [emitted]         app
      index.html  189 bytes          [emitted]
   [0] ./src/index.js 594 bytes {1} [built]
   [2] (webpack)/buildin/global.js 509 bytes {0} [built]
   [3] (webpack)/buildin/module.js 517 bytes {0} [built]
    + 1 hidden module
Child html-webpack-plugin for "index.html":
     1 asset
       [2] (webpack)/buildin/global.js 509 bytes {0} [built]
       [3] (webpack)/buildin/module.js 517 bytes {0} [built]
        + 2 hidden modules
```

之前说过 `import()` 会返回一个 promise, 所以它可以和 `async函数` 一起使用. 但是需要 Babel这样的预处理器和 [Syntax Dynamic Import Babel Plugin](https://babeljs.io/docs/plugins/syntax-dynamic-import/#installation).

下一步 [懒加载](https://github.com/Caraws/webpack-demo/tree/master/lazy-loading)

Created on 2018-2-24 by cara