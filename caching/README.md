# 缓存
之前我们使用 `webpack` 来打包我们模块化后的应用程序, `webpack` 会生成一个 `/dist` 目录, 然后把打包后的文件放在此目录中. 只要将 `/dist` 中的内容部署到服务器上, 客户点就能访问到此服务器上的资源. 而获取资源是比较耗时的, 这就是为什么浏览器要使用缓存, 通过命中缓存以降低网络流量, 使网站速度加快. 然而如果我们在更新新版本时, 没有修改文件名, 浏览器可能会认为它没有更新, 继续使用缓存版本. 因此这一节的内容就是保证你在更新版本后, 浏览器能够在内容发生变化时请求到新的文件. [延用 lazy-loading 的代码](https://github.com/Caraws/webpack-demo/tree/master/lazy-loading)

> 我在写这一节的时候 webpack 已经更新到了 4.x 版本, 由于 4.x 删除了一些插件, 所以我把 webpack 降到了 3.11.0 的版本, 在 package.json 中锁定一下版本就好

### 输出文件的文件名
通过使用 `output.filename` 进行[文件名替换](https://doc.webpack-china.org/configuration/output#output-filename), 可以确保浏览器获取到修改后的文件. `[hash]` 替换可以用于文件名中包含一个构建相关的 hash, 但更好的方式是 `[chunkhash]` 替换, 在文件名中包含一个跟 chunk 相关的 hash

webpack.config.js
```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

exports.default = {
    entry: {
        app: './src/index.js'
    },
    output: {
        // 添加 chunkhash
        filename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        // 修改标题
        new HtmlWebpackPlugin({
            title: 'caching'
        }),
        new CleanWebpackPlugin(['dist'])
    ]
}
```

`npm run build` 构建, 输出如下:

```shell
➜  caching git:(master) ✗ npm run build

> caching@1.0.0 build /Users/cara/workspace/project/webpack-demo/caching
> webpack

clean-webpack-plugin: /Users/cara/workspace/project/webpack-demo/caching/dist has been removed.
Hash: d11213fde2d4bfd5f53e
Version: webpack 3.11.0
Time: 674ms
                      Asset       Size  Chunks                    Chunk Names
  0.c32c13ef27544b1d5633.js  376 bytes       0  [emitted]         print
app.fa6bf03db0d58e425216.js     548 kB       1  [emitted]  [big]  app
                 index.html  196 bytes          [emitted]
   [0] ./src/index.js 574 bytes {1} [built]
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

可以看到 bundle 的名称是它的内容 ( 通过 hash ) 映射, 如果不做修改文件名可能会变也可能不会变.


### 提取样板
`webpack` 中包含了一些样板, 特别是 `runtime` 和 `manifest`(样板指的是 webpack 运行时的引导代码). `CommonsChunkPlugin` 不但可以分离文件, 也可以将 `webpack` 的样板和 manifest 提取出来. 通过制定 `entry` 配置中未用到的名称, 此插件会自动将我们需要的内容提取到单独的包中

webpack.config.js
```js
const path = require('path')
const Webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

exports.default = {
    entry: {
        app: './src/index.js'
    },
    output: {
        filename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'caching'
        }),
        new CleanWebpackPlugin(['dist']),
        // 提取样板
        new Webpack.optimize.CommonsChunkPlugin({
            name: 'manifest'
        })
    ]
}
```

再次构建提取出 manifest 文件, 输出如下:

```shell
➜  caching git:(master) ✗ npm run build

> caching@1.0.0 build /Users/cara/workspace/project/webpack-demo/caching
> webpack

clean-webpack-plugin: /Users/cara/workspace/project/webpack-demo/caching/dist has been removed.
Hash: 8e87b4cd74b6c0ead120
Version: webpack 3.11.0
Time: 616ms
                           Asset       Size  Chunks                    Chunk Names
       0.c32c13ef27544b1d5633.js  376 bytes       0  [emitted]         print
     app.e9751de89144e751b13d.js     542 kB       1  [emitted]  [big]  app
manifest.446e5e10b8c766f65b12.js    5.82 kB       2  [emitted]         manifest
                      index.html  275 bytes          [emitted]
   [0] ./src/index.js 574 bytes {1} [built]
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

像一些第三方库就可以使用这样的方法来单独提取到 `vendor` chunk文件中, 因为它们不想本地文件更新那么频繁, 完全可以然后客户端长效缓存. 可以再使用一个 `CommonsChunkPlugin` 额外配置组合实现.

>注意: 引入顺序在这里很重要. CommonsChunkPlugin 的 'vendor' 实例，必须在 'manifest' 实例之前引入

webpack.config.js
```js
const path = require('path')
const Webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

exports.default = {
    entry: {
        app: './src/index.js',
        vendor: ['lodash']
    },
    output: {
        filename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'caching'
        }),
        new CleanWebpackPlugin(['dist']),
        // 在 manifest 之前引入
        new Webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'
        }),
        new Webpack.optimize.CommonsChunkPlugin({
            name: 'manifest'
        })
    ]
}
```

再次构建, 查看新的 `vendor` bundle:

```shell
➜  caching git:(master) ✗ npm run build

> caching@1.0.0 build /Users/cara/workspace/project/webpack-demo/caching
> webpack

clean-webpack-plugin: /Users/cara/workspace/project/webpack-demo/caching/dist has been removed.
Hash: 71dc81ab3d2340b6a9c0
Version: webpack 3.11.0
Time: 662ms
                           Asset       Size  Chunks                    Chunk Names
       0.db2acf91ec38187b480f.js  376 bytes       0  [emitted]         print
  vendor.3b64ae13adc1af9133bb.js     541 kB       1  [emitted]  [big]  vendor
     app.8752085bc2c0f5adb16b.js    1.06 kB       2  [emitted]         app
manifest.ffcf1822ddf440340858.js    5.82 kB       3  [emitted]         manifest
                      index.html  352 bytes          [emitted]
   [1] ./src/index.js 574 bytes {2} [built]
   [2] (webpack)/buildin/global.js 509 bytes {1} [built]
   [3] (webpack)/buildin/module.js 517 bytes {1} [built]
   [4] multi lodash 28 bytes {1} [built]
   [5] ./src/print.js 124 bytes {0} [built]
    + 1 hidden module
Child html-webpack-plugin for "index.html":
     1 asset
       [2] (webpack)/buildin/global.js 509 bytes {0} [built]
       [3] (webpack)/buildin/module.js 517 bytes {0} [built]
        + 2 hidden modules
```

### 模块标识符

src/print.js
```js
export default (text) => {
    console.log('print.js: ' + text)
}
```

src/index.js
```js
import _ from 'lodash'
import print from './print'

const component = () => {
    let element = document.createElement('div')

    element.innerHTML = _.join(['Hello', 'webpack'], ' ')

    element.onclick = print.bind(null, 'hello print!')

    return element
}

document.body.appendChild(component())
```

然后再次构建, 然后我们期望的是只有 `app` bundle 的 hash 发生变化, 然而...
```shell
➜  caching git:(master) ✗ npm run build

> caching@1.0.0 build /Users/cara/workspace/project/webpack-demo/caching
> webpack

clean-webpack-plugin: /Users/cara/workspace/project/webpack-demo/caching/dist has been removed.
Hash: 226dba4b1d8f3fc14a67
Version: webpack 3.11.0
Time: 615ms
                           Asset       Size  Chunks                    Chunk Names
  vendor.6b4652b54edc5bf3eb3a.js     541 kB       0  [emitted]  [big]  vendor
     app.e328ea3f54ddf17c1c68.js    1.17 kB       1  [emitted]         app
manifest.85f4f337e94b40a6c472.js    3.84 kB       2  [emitted]         manifest
                      index.html  352 bytes          [emitted]
   [0] multi lodash 28 bytes {0} [built]
[lVK7] ./src/index.js 709 bytes {1} [built]
[nvO+] (webpack)/buildin/global.js 509 bytes {0} [built]
[pFAE] (webpack)/buildin/module.js 517 bytes {0} [built]
    + 1 hidden module
Child html-webpack-plugin for "index.html":
     1 asset
    [nvO+] (webpack)/buildin/global.js 509 bytes {0} [built]
    [pFAE] (webpack)/buildin/module.js 517 bytes {0} [built]
        + 2 hidden modules
```
三个值都发生了变化, 这是因为三个文件 hash 值都发生变化是因为每一个 `module.id` 会基于默认的解析顺序(resolve order)进行增量. 也就是说解析顺序发生变化, ID 也会随之变化. 概括为:

- `app` bundle 会随自身内容的修改而发生变化
- `vendor` bundle 会随自身 `module.id` 的修改而发生变化
- `manifest` bundle 会因为当前包含一个新模块的引用，而发生变化

我的情况是: 当我注释掉 `index.js` 中的 onclick 事件再重新构建, 只有 `app.js` 的 hash 发生了改变这是符合我们预期的. 而`index.js` 中 `print.js` 的引用方式发上改变时, 三个 hash 才会都发生变化. `app` 和 `maifest` 是符合预期的, 只有 `vendor` 的 hash 变化是需要我们修复的, 有两个插件: 1. [NamedModulesPlugin](https://doc.webpack-china.org/plugins/named-modules-plugin) 将使用模块的路径, 这有助于开发中输出结果的可读性但是执行时间长一些(用于开发环境); 2. [HashedModuleIdsPlugin](https://doc.webpack-china.org/plugins/hashed-module-ids-plugin) 推荐用于生产环境:

webpack.config.js
```js
const path = require('path')
const Webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

exports.default = {
    entry: {
        app: './src/index.js',
        vendor: ['lodash']
    },
    output: {
        // 添加 chunkhash
        filename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'caching'
        }),
        new CleanWebpackPlugin(['dist']),
        // 保证 vendor 的 hash 不会改变
        new Webpack.HashedModuleIdsPlugin(),
         // 在 manifest 之前引入
        new Webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'
        }),
        // 提取样板
        new Webpack.optimize.CommonsChunkPlugin({
            name: 'manifest'
        })
    ]
}
```

src/index.js, 修改 print.js 的引入
```js
import _ from 'lodash'
// import print from './print'

const component = () => {
    let element = document.createElement('div')

    element.innerHTML = _.join(['Hello', 'webpack'], ' ')

    // element.onclick = print.bind(null, 'hello print!')

    return element
}

document.body.appendChild(component())
```

然后再次构建, 看看 `vendor` bundle 还会不会发生改变:
```shell
➜  caching git:(master) ✗ npm run build

> caching@1.0.0 build /Users/cara/workspace/project/webpack-demo/caching
> webpack

clean-webpack-plugin: /Users/cara/workspace/project/webpack-demo/caching/dist has been removed.
Hash: 1a7b755f6ee5709973e8
Version: webpack 3.11.0
Time: 614ms
                           Asset       Size  Chunks                    Chunk Names
  vendor.6b4652b54edc5bf3eb3a.js     541 kB       0  [emitted]  [big]  vendor
     app.46b846d7610ca7e0d92f.js     1.5 kB       1  [emitted]         app
manifest.85f4f337e94b40a6c472.js    3.84 kB       2  [emitted]         manifest
                      index.html  352 bytes          [emitted]
[3Di9] ./src/print.js 65 bytes {1} [built]
   [0] multi lodash 28 bytes {0} [built]
[lVK7] ./src/index.js 703 bytes {1} [built]
[nvO+] (webpack)/buildin/global.js 509 bytes {0} [built]
[pFAE] (webpack)/buildin/module.js 517 bytes {0} [built]
    + 1 hidden module
Child html-webpack-plugin for "index.html":
     1 asset
    [nvO+] (webpack)/buildin/global.js 509 bytes {0} [built]
    [pFAE] (webpack)/buildin/module.js 517 bytes {0} [built]
        + 2 hidden modules
```
我们可以看到两次的 `vendor` bundle 的 hash 都是 `6b4652b54edc5bf3eb3a`. 现在就可以随便修改任何新的本地依赖, 每次构建后的 `vendor` bundle 都应该不会再发生改变


Created on 2018-3-23 by cara