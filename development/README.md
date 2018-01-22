# 开发
这里的代码继续沿用之前 `output` 中的文件, 注意: 这里的配置仅在开发环境中使用.

### 准备工作
先把 `my-index.html` 删掉, 然后修改 `webpack.config.js`

webpack.config.js
```js
plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
        title: 'this title from HtmlWebpackPlugin'
    }),
    // 删掉这几行
-    new HtmlWebpackPlugin({
-       title: 'Custom template',
-       template: 'my-index.html'
-    })
]
```

### 使用 source map
在我们用了 `webpack` 打包项目之后, 会很难追踪到报错的地方再源代码的什么位置. 报错会直接指向打包的`.js` 文件, 然而并没有什么卵用. 所以为了更好的追踪到报错的位置, 就要用到JavaScript提供的 source map, 它会将编译后的代码映射会原始的代码. 比如错误来自于 `a.js` 那么 source map 就会明确的告诉你.

source map [有很多的选项](https://doc.webpack-china.org/configuration/devtool) 可以使用, 你可以根据需要来配置. 在这里我们跟着官网文档使用 `inline-source-map` 选项.

webpack.config.js 中, 加入 source map
```js
module.exports = {
    ...
    devtool: 'inline-source-map'
}
```

运行 `npm run build`, 然后在浏览器中查看 `dist/index.html` 的控制台信息, 如下:
```shell
print.js:5  I am error message from print.js!
```

现在我们就可以明确的看到错误来自于 `print.js` 的第五行

### 选择一个开发工具
每次要编译代码, 都需要我们输入 `npm run build` 这样会很麻烦, `webpack` 有几个选项, 可以让代码发生变化的时候帮你自动编译代码: 

1. webpack's Watch Mode
2. webpack-dev-server
3. webpack-dev-middleware

下面我们就来一个一个地玩一下上面的所有选项吧.

- 使用观察模式
指示 `webpack` 去 watch 所有的文件, 以便于其中一个文件被更新代码将被重新编译, 就不需要我们手动去运行整个构建了.

先添加一个启动 webpack 的观察模式的 npm script 脚本

package.json
```json
"scripts": {
    "build": "webpack",
    // 添加这行
    "watch": "webpack --watch"
}
```

输入 `npm run watch` 可以看到命令行中 watch 启动而命令行没有退出, 我们接着修改来试验一下

src/print.js
```js
export default function printSome () {
    console.log('I get called from print.js!')
    // 把错误信息删掉 然后保存
}
```

保存修改之后, 在命令行中就可以看到构建信息了, 如下:
```zsh
Hash: b5196af777fcae6c2515
Version: webpack 3.10.0
Time: 478ms
          Asset       Size  Chunks                    Chunk Names
  app.bundle.js    1.44 MB    0, 1  [emitted]  [big]  app
print.bundle.js    6.48 kB       1  [emitted]         print
     index.html  270 bytes          [emitted]
   [0] ./src/print.js 97 bytes {0} {1} [built]
    + 4 hidden modules
Child html-webpack-plugin for "index.html":
     1 asset
       4 modules
```

唯一的缺点是构建完之后, 要刷新浏览器才能看到更改后的效果. 如果能自动刷新就好了, 接着试试 `webpack-dev-server` 正好有我们想要的实现功能

- 使用 webpack-dev-server
它为我们提供一个简单的 web 服务器, 而且能够实时重新加载

```zsh
npm install --save-dev webpack-dev-server
```

webpack.config.js
```js
module.exports = {
    ...
    // 告诉 webpack-dev-server 在 localhost:8080 下建立服务
    // 将 './dist' 文件夹下的文件作为可访问文件
    devServer: {
        contentBase: './dist'
    }
}
```

package.json, scripts 中再加入一行启动 `webpack-dev-server`
```json
"start": "webpack-dev-server --open"
```

输入命令 `npm start` 就会看到浏览器自动加载页面了. 我自己的电脑在试验的时候 `localhost:8080` 端口是被之前的东西占用了的, 不过看到浏览器自动换成了 `localhost:8081` 来启动的, 然后我们来改改代码看看能不能实现编译后自动刷新吧

print.js
```js
export default function printSome () {
    console.log('I get called from print.js!')
    // 添加一条 console 信息
    console.log('test webpack-dev-server!')
}
```

保存之后, 我们想要的功能就实现啦, 输出信息如下:
```zsh
➜  development npm start

> development@1.0.0 start /Users/cara/workspace/project/webpack-demo/development
> webpack-dev-server --open

clean-webpack-plugin: /Users/cara/workspace/project/webpack-demo/development/dist has been removed.
Project is running at http://localhost:8081/
webpack output is served from /
Content not from webpack is served from ./dist
webpack: wait until bundle finished: /
Hash: d41f4340711aeb2ec907
Version: webpack 3.10.0
Time: 2235ms
          Asset       Size  Chunks                    Chunk Names
  app.bundle.js    2.27 MB       0  [emitted]  [big]  app
print.bundle.js     839 kB       1  [emitted]  [big]  print
     index.html  270 bytes          [emitted]
   [0] (webpack)/buildin/global.js 509 bytes {0} {1} [built]
   [3] ./node_modules/_webpack-dev-server@2.11.0@webpack-dev-server/client?http://localhost:8081 7.91 kB {0}{1} [built]
   [4] ./node_modules/_url@0.11.0@url/url.js 23.3 kB {0} {1} [built]
   [7] ./node_modules/_querystring-es3@0.2.1@querystring-es3/index.js 127 bytes {0} {1} [built]
  [10] ./node_modules/_strip-ansi@4.0.0@strip-ansi/index.js 150 bytes {0} {1} [built]
  [12] ./node_modules/_loglevel@1.6.1@loglevel/lib/loglevel.js 7.86 kB {0} {1} [built]
  [13] ./node_modules/_webpack-dev-server@2.11.0@webpack-dev-server/client/socket.js 1.08 kB {0} {1} [built]
  [15] ./node_modules/_webpack-dev-server@2.11.0@webpack-dev-server/client/overlay.js 3.67 kB {0} {1} [built]
  [20] ./node_modules/webpack/hot nonrecursive ^\.\/log$ 170 bytes {0} {1} [built]
  [22] (webpack)/hot/emitter.js 77 bytes {0} {1} [built]
  [24] ./src/print.js 97 bytes {0} {1} [built]
  [25] multi ./node_modules/_webpack-dev-server@2.11.0@webpack-dev-server/client?http://localhost:8081 ./src/index.js 40 bytes {0} [built]
  [26] ./src/index.js 421 bytes {0} [built]
  [27] ./node_modules/_lodash@4.17.4@lodash/lodash.js 540 kB {0} [built]
  [28] multi ./node_modules/_webpack-dev-server@2.11.0@webpack-dev-server/client?http://localhost:8081 ./src/print.js 40 bytes {1} [built]
    + 14 hidden modules
Child html-webpack-plugin for "index.html":
     1 asset
       [0] ./node_modules/_html-webpack-plugin@2.30.1@html-webpack-plugin/lib/loader.js!./node_modules/_html-webpack-plugin@2.30.1@html-webpack-plugin/default_index.ejs 553 bytes {0} [built]
       [1] ./node_modules/_lodash@4.17.4@lodash/lodash.js 540 kB {0} [built]
       [2] (webpack)/buildin/global.js 509 bytes {0} [built]
       [3] (webpack)/buildin/module.js 517 bytes {0} [built]
webpack: Compiled successfully.
webpack: Compiling...
Hash: 2f34c4d50053aba032eb
Version: webpack 3.10.0
Time: 711ms
          Asset       Size  Chunks                    Chunk Names
  app.bundle.js    2.27 MB       0  [emitted]  [big]  app
print.bundle.js     839 kB       1  [emitted]  [big]  print
     index.html  270 bytes          [emitted]
  [20] ./node_modules/webpack/hot nonrecursive ^\.\/log$ 170 bytes {0} {1} [built]
  [24] ./src/print.js 98 bytes {0} {1} [built]
    + 27 hidden modules
Child html-webpack-plugin for "index.html":
     1 asset
       4 modules
webpack: Compiled successfully.
webpack: Compiling...
Hash: d2a58751be45aa427f1d
Version: webpack 3.10.0
Time: 642ms
          Asset       Size  Chunks                    Chunk Names
  app.bundle.js    2.27 MB       0  [emitted]  [big]  app
print.bundle.js     839 kB       1  [emitted]  [big]  print
     index.html  270 bytes          [emitted]
  [20] ./node_modules/webpack/hot nonrecursive ^\.\/log$ 170 bytes {0} {1} [built]
  [24] ./src/print.js 141 bytes {0} {1} [built]
    + 27 hidden modules
Child html-webpack-plugin for "index.html":
     1 asset
       4 modules
webpack: Compiled successfully.
```
= = 之所以我又这么多输出信息是因为我改了好几次.

- 使用 webpack-dev-middleware (Vue 中用的就是这个)
`webpack-dev-middleware` 是一个中间件容器, 它通过 webpack 处理文件后的文件发布到一个服务器. 内部它还是使用的 `webpack-dev-server`, 但是它可以作为一个单独的包来使用, 这样就可以自定义配置来实现自己的需求. 下面会用 `webpack-dev-middleware` 和 `express`(node.js 的一个框架) 来使用.

依然先安装 `webpack-dev-middleware` 和 `express`:
```zsh
npm install --save-dev webpack-dev-middleware express
```

webpack.config.js 中:
```js
module.exports = {
    ...
    ouput: {
        filename: [name].bundle.js,
        path: path.resolve(__dirname, 'dist'),
        // 告诉 webpack-dev-middleware 运行地址
        publicPath: '/'
    }
    ...
}
```

接着要新建一个 `server.js`, 用来启动我们的服务器:

project
```shell
  development
  |- package.json
  |- webpack.config.js
+ |- server.js
  |- /dist
  |- /src
    |- index.js
    |- print.js
  |- /node_modules
```
server.js
```js
const express = require('express')
const webpack = require('webpack')
const WebpackDevMiddleware = require('webpack-dev-middleware')

const app = express()
const config = require('./webpack-dev-middleware')
const compiler = webpack(config)

app.use(WebpackDevMiddleware(compiler, {
    publicPath: config.ouput.publicPath
}))

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('express is listening on ' + port)
})
```

package.json 中, 给 `webpack-dev-middleware` 配个启动:
```json
...

scripts: {
    ...
    "server": "node server.js"
    ...
}

...
```

然后通过 `npm run server` 跑起来, 接着再改改 `print.js` 看看效果:

print.js
```js
export default function printSome () {
    console.log('I get called from print.js!')
    // console.log('test webpack-dev-server!')
    console.log('test webpack-dev-middleware!')
}
```

结果这个配置的 `webpack-dev-middleware` 和 `watch` 是差不多的效果, 需要刷新才能看到效果, 不同的是 `webpack-dev-middleware` 运行之后 `dist` 文件夹不见了.这是因为 webpack 把文件打包到了内存当中, 不生成文件的原因是因为直接从内存访问代码比从系统文件中读取更快, 而且也减少了将代码写入文件的开销. 所以这一小节主要是学习如何自动编译和运行一个简单的开发服务器, 我们知道 `Vue.js` 中的 webpack 还可以热替换的(这跟 live reload 是有本质区别的, live reload 不会保存应用状态), 所以下面再去看看热替换.

下一节 [热替换](https://github.com/Caraws/webpack-demo/tree/master/hot-module-replacement)

Created on 2017-1-19 by cara