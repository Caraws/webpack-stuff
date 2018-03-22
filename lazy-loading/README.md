# 懒加载
这一节的代码继承于 [代码分离](https://github.com/Caraws/webpack-demo/tree/master/code-splitting), 懒加载是一种优化网页或应用的方式. 这是方式实际上是先把你的代码在一些逻辑断点处分离开, 然后在一些代码中完成某些操作后, 立即引用或即将引用另外一些新的代码块. 这样加快了应用的初始速度, 减轻总体积, 因为有些代码可能永远不会被加载.

### 示例
我们的期望目标是: 当用户第一次交互时才加载一个 `print.js`, 然后 console 出一些打印信息, 这样在用户永不交互时就不会加载这个包. 为此我们要把 `lodash` 和 `print.js` 加入删除之前的 `another-module.js`.

src/print.js
```
console.log('The print.js has loaded!')

// 默认导出一个方法
export default () => {
    console.log('Button clicked: here is some print text')
}
```

src/index.js
```js
import _ from 'lodash'

const component = () => {
    let element = document.createElement('div')
    let button = document.createElement('button')
    let br = document.createElement('br')

    element.innerHTML = _.join(['Hello', 'webpack'], ' ')
    button.innerHTML = 'click me and look console'

    element.appendChild(br)
    element.appendChild(button)

    // 懒加载 print 模块
    button.onclick = e => import(/* webpackChunkName: 'print' */ './print').then(module => {
        let print = module.default
        print()
    })

    return element
}

document.body.appendChild(component())
```

现在 `npm run build` 一切正常命令行会有如下输出:
```shell
➜  lazy-loading git:(master) ✗ npm run build

> lazy-loading@1.0.0 build /Users/cara/workspace/project/webpack-demo/lazy-loading
> webpack

clean-webpack-plugin: /Users/cara/workspace/project/webpack-demo/lazy-loading/dist has been removed.
Hash: 73020b2c257da9e0d23f
Version: webpack 3.11.0
Time: 883ms
          Asset       Size  Chunks                    Chunk Names
print.bundle.js  376 bytes       0  [emitted]         print
  app.bundle.js     548 kB       1  [emitted]  [big]  app
     index.html  189 bytes          [emitted]
   [0] ./src/index.js 972 bytes {1} [built]
   [2] (webpack)/buildin/global.js 509 bytes {1} [built]
   [3] (webpack)/buildin/module.js 517 bytes {1} [built]
   [4] ./src/print.js 124 bytes {0} [built]
    + 1 hidden module
Child html-webpack-plugin for "index.html":
     1 asset
       [2] (webpack)/buildin/global.js 509 bytes {0} [built]
       [3] (webpack)/buildin/module.js 517 bytes {0} [built]
        + 2 hidden modules
```

已经看到 `print.js` 被单独打包了, 然后在构建后的 `dist` 文件夹中在浏览器中打开 `index.html`, 在控制台中打开 Sources 就只会看到两个文件夹, 分别是 `index.html` 和 `app.bundle.js`. 接着点击 `button` 后 `print.bundle.js` 才被加载, console 也输出了打印消息.

主流框架的懒加载方案:
- React: [Code Splitting and Lazy Loading](https://reacttraining.com/react-router/web/guides/code-splitting)
- Vue: [Lazy Load in Vue using Webpack's code splitting](https://alexjoverm.github.io/2017/07/16/Lazy-load-in-Vue-using-Webpack-s-code-splitting/)

下一步 [缓存](https://github.com/Caraws/webpack-demo/tree/master/caching)

Created on 2018-3-22 by cara