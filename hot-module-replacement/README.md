# 热替换
模块热替换(HMR)算是 webpack 中提供的最常用的功能之一, 它可以在运行时更新各种模块, 无需我们手动刷新. 同样热替换也只适用于开发环境, 这里也继续延用 `开发` 中的代码.

### 启用 HMR
使用 `webpack` 内置的 HMR 插件, 改动 `webpack-dev-server` 的配置来启用.

webpack.config.js
```js
...

const webpack = require('webpack')

module.exports = {
    entry: {
        app: './src/index.js'
        // 删除 print 入口
    },
    ...
    devServer: {
        contentBase: './dist',
        hot: true
    }
    ...
}
```

index.js
```js
import _ from "lodash"
import printSome from "./print"

function component () {
    let element = document.createElement('div')
    let btn = document.createElement('button')

    element.innerHTML = _.join(['hello', 'webpack'], ' ')

    btn.innerHTML = 'click me'
    btn.onclick = printSome

    element.appendChild(btn)
    return element
}
document.body.appendChild(component());

if (module.hot) {
    module.hot.accept('./print', () => {
        console.log('Accepting the updated printMe module!')
        printSome()
    });
}
```

启动 `npm start`, module.hot.accept 用于 `print.js` 内部发生变化时通知 webpack 接受更新模块. 修改 `print.js` 里面的 console, 在浏览器的控制台中你应该会看到:

```shell
[HMR] Waiting for update signal from WDS...
app.bundle.js:26451 [WDS] Hot Module Replacement enabled.
2client?207d:80 [WDS] App updated. Recompiling...
client?207d:222 [WDS] App hot update...
log.js:23 [HMR] Checking for updates on the server...
index.js:27 Accepting the updated printMe module!
```
现在就实现我们想要的热替换啦, 打开浏览器控制台 Network 也可以看到 server 回传到浏览器发生了更新的模块, 不过这里有个地方要注意 **`import print from './print'` 这里引入写的 `./print` 那么下面 module.exports.accept 中就一定要写 `./print`** 这两个地方一定要对上, 之前就是这个错误我找了一下午😒.

### 使用 `webpack-hot-middleware` 启用 HMR
[webpack-hot-middleware](https://github.com/glenjamin/webpack-hot-middleware) 是配合 `webpack-dev-middleware` 中间件来使用热替换的, 主要是看到 `Vue` 的配置用的是 `webpack-hot-middleware`, 所以来试试.

首先也是安装
```zsh
npm install --save-dev webpack-hot-middleware
```

**多入口:**

webpack.config.js
```js
module.exports = {
    context: __dirname,
    entry: {
        // 多个入口文件跟 server.js 建立连接
        index: ['webpack-hot-middleware/client?reload=true', './src/index.js'],
        print: ['webpack-hot-middleware/client?reload=true', './src/print.js']
    },
    // ...
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'Hot Module Replacement'
        }),
        // 热替换
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ],
    // ...
}
```

server.js
```js
...

const WebpackHotMiddleware = require('webpack-hot-middleware')

...

app.use(WebpackHotMiddleware(compiler))

...
```

现在运行 `npm run server` 并修改 `/src/index.js` 或者 `/src/print.js` 文件的内容就能看见效果了.

**单入口:**

webpack.config.js
```js
...
module.exports = {
    // 删除 context
    entry: [
        'webpack-hot-middleware/client?reload=true',
        './src/index.js'
    ]
    ...
}
```
index.js
```js
// 入口文件
import _ from "lodash"
import printSome from "./print"

function component () {
    let element = document.createElement('div')
    let btn = document.createElement('button')


    element.innerHTML = _.join(['hello', 'webpack'], ' ')

    btn.innerHTML = 'click me'
    btn.onclick = printSome

    element.appendChild(btn)
    return element
}

console.log(1)

let element = component()
document.body.appendChild(element)

// 监听引入文件的改动
if (module.hot) {
    module.hot.accept('./print', () => {
        console.log('Accepting the updated printMe module!')

        document.body.removeChild(element)
        element = component(); 
        document.body.appendChild(element)
    });
}
```

再次执行 `npm run server`, 看到命令行还是正常运行打开浏览器, 然后修改 `src/print.js` 的 console.log, 热替换也就成功啦~

下一节 [Tree Shaking](https://github.com/Caraws/webpack-demo/tree/master/tree-shaking)

Created on 2017-1-22 by cara