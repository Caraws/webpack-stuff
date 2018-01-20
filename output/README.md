# webpack output 的配置
跟着[webpack 官网](https://doc.webpack-china.org/guides/output-management/)做一遍入个门

### 准备工作

1. 将之前 entry 中的项目复制一份过来
2. `src` 文件夹只留下 `index.js` 并新建一个 `print.js`
3. `webpack.config.js` 中删除 `module`

### 开始

src/print.js 中:
```js
export default function printSomeThing () {
    console.log('I get called from print.js!')
}
```

src/index.js 中引入并添加一下代码:
```js
// 未提到部分不变
import printSomeThing from './print'

function component () {
    let element = document.createElement('div')
    let btn = document.createElement('button')


    element.innerHTML = _.join(['hello', 'webpack'], ' ')

    btn.innerHTML = 'click me and check print something'
    btn.onclick = printSome

    element.appendChild(btn)
    return element
}
```

dist/index.html 中, 作一些修改为分离入门做准备:
```html
<title>webpack-output</title>
<body>
    <script src="./print.bundle.js"></script>
    <script src="./app.bundle.js"></script>
</body>
```

webpack.config.js 中, 调整配置项: 
```js
module.exports = {
    // 分离入口
    entry: {
        app: './src/index.js',
        print: './src/print.js'
    },
    output: {
        // [name]将对应 entry 中的属性名
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
}
```

现在执行 `npm run build` 看到生成结果:
```zsh
Hash: 000f96eee4eec4e68a66
Version: webpack 3.10.0
Time: 448ms
          Asset     Size  Chunks                    Chunk Names
  app.bundle.js   545 kB    0, 1  [emitted]  [big]  app
print.bundle.js  2.75 kB       1  [emitted]         print
   [0] ./src/print.js 95 bytes {0} {1} [built]
   [1] ./src/index.js 421 bytes {0} [built]
   [3] (webpack)/buildin/global.js 509 bytes {0} [built]
   [4] (webpack)/buildin/module.js 517 bytes {0} [built]
    + 1 hidden module
```

然后我们可以在 `dist` 文件夹中看到重新生成了两个文件: app.bundle.js 和 print.bundle.js, 刚好和我们在 `dist/index.html` 中指定的文件名对应, 然后打开浏览器访问 index.html 并点击按钮在控制台就可以看见输出信息了.

如官网所说, 如果我们修改了一个入门文件的名称或者添加了一个新的名称, 构建之后生成新的文件, 但是在 index.html 中依然用的是旧名称, 意味着我们每次都要主动去修改文件名. 为了解决这个问题, 可以使用 `HtmlWebpackPlugin` 插件来解决.

#### 使用 `HtmlWebpackPlugin`

安装插件 `npm install --save-dev html-webpack-plugin`

webapck.config.js 中, 使用插件:
```js
const HtmlWebpackPlugin from 'html-webpack-plugin'

plugins: [
    // 使用插件将重新生成一个新的 index.html 覆盖我们原来的 index.html
    new HtmlWebpackPlugin({
        // 此处的 title 将 index.html中的 <title> 显示
        title: 'this title from HtmlWebpackPlugin'
    })
]
```

执行 `npm run build` 再看看生成结果:
```zsh
Hash: 85925013860a6e2ebc8d
Version: webpack 3.10.0
Time: 808ms
          Asset       Size  Chunks                    Chunk Names
  app.bundle.js     545 kB    0, 1  [emitted]  [big]  app
print.bundle.js    2.75 kB       1  [emitted]         print
     index.html  259 bytes          [emitted]
   [0] ./src/print.js 97 bytes {0} {1} [built]
   [1] ./src/index.js 421 bytes {0} [built]
   [3] (webpack)/buildin/global.js 509 bytes {0} [built]
   [4] (webpack)/buildin/module.js 517 bytes {0} [built]
    + 1 hidden module
Child html-webpack-plugin for "index.html":
     1 asset
       [2] (webpack)/buildin/global.js 509 bytes {0} [built]
       [3] (webpack)/buildin/module.js 517 bytes {0} [built]
        + 2 hidden modules
```

如上我们可以看到 `HtmlWebpackPlugin` 默认会生成一个新的 `index.html` 文件, 这个会覆盖我们之前的 `index.html`, 在 `dist/index.html` 打开这个新的 `index.html` 文件就可以看到所有构建的 bundle 文件都被自动添加到了文件当中, `<title>` 标签中的文本也变成我们设置的字符串了.

如果你用过 [Vue.js](https://cn.vuejs.org/) 你可能注意到 `HtmlWebpackPlugin` 有一个经常用到的 option 是 `template: xxx.html`, 这个选项就是把你选择的 html 内容注入到生成的 `index.html` 中, 我们可以试一试:

根目录新建一个 my-index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>my-index</title>
</head>
<body>
    121321
    <p>i'm from my-index.html</p>
</body>
</html>
```

webpack.config.js
```js
plugins: [
    new HtmlWebpackPlugin({
        title: 'this title from HtmlWebpackPlugin'
    }),
    // 再加入一个, 看看会怎么样
    new HtmlWebpackPlugin({
        title: 'Custom template',
        template: 'my-index.html'
    })
]
```
运行 `npm run build` 构建完成之后, 打开 `index.html` 可以看到我们的 `my-index.html` 中的内容被添加到了 `index.html`, 而 `<title>` 标签中的文本变成了 `my-index.html` 中的 `<title>`. 关于其他的 `HtmlWebpackPlugin` 用法可以到 [HtmlWebpackPlugin的官方仓库](https://github.com/jantimon/html-webpack-plugin) 去看.

#### 清理 `dist` 文件夹
在之前的演示中, 我们跟着官网已经构建了好几次 `dist` 文件了. 像 `bundle.js` 就是之前构建的, 后面我们再也没有用到过了, `webpack` 本身并不能追踪有哪些文件是用到了哪些没有用到. 我们最期望的是每次只生成用到的文件, 所以 `clean-webpack-plugin` 这个插件是一个不错的选择.

安装 `npm install clean-webpack-plugin --save-dev`

webpack.config.js 中, 使用:
```js
const CleanWebpackPlugin = require('clean-webpack-plugin')

plugins: [
    // 使用插件
    new CleanWebpackPlugin(['dist'])
]
```

重新构建 `npm run build`, 将看到如下输出:
```zsh
clean-webpack-plugin: /Users/cara/workspace/project/webpack-demo/output/dist has been removed.
Hash: e08919682f4af51808f7
Version: webpack 3.10.0
Time: 1168ms
          Asset       Size  Chunks                    Chunk Names
  app.bundle.js     545 kB    0, 1  [emitted]  [big]  app
print.bundle.js    2.75 kB       1  [emitted]         print
     index.html  425 bytes          [emitted]
   [0] ./src/print.js 97 bytes {0} {1} [built]
   [1] ./src/index.js 421 bytes {0} [built]
   [3] (webpack)/buildin/global.js 509 bytes {0} [built]
   [4] (webpack)/buildin/module.js 517 bytes {0} [built]
    + 1 hidden module
Child html-webpack-plugin for "index.html":
     1 asset
       [0] ./node_modules/_html-webpack-plugin@2.30.1@html-webpack-plugin/lib/loader.js!./my-index.html 686 bytes {0} [built]
       [2] (webpack)/buildin/global.js 509 bytes {0} [built]
       [3] (webpack)/buildin/module.js 517 bytes {0} [built]
        + 1 hidden module
Child html-webpack-plugin for "index.html":
     1 asset
       [2] (webpack)/buildin/global.js 509 bytes {0} [built]
       [3] (webpack)/buildin/module.js 517 bytes {0} [built]
        + 2 hidden modules
```
再看看 `dist` 文件夹, 原本没用的 `bundle.js` 已经没有了, 只剩下构建后生成的文件了.

Created on 2017-1-19 by cara