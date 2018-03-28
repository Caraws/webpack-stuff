# webpack 入门
由于之前一直使用 [Vue.js](https://cn.vuejs.org/) 来开发项目, `Vue` 使用 `webpack` 来构建项目. 在工作中有时候出现 `webpack` 方面的问题实在是无从下手, 所以到现在终于有时间来好好了解下 `webpack` , 想要优化打包速度和更改配置也是需要花费很长时间. 之前的官方文档太不亲民, 不过现在 [`3.10.0` 版本的文档](https://doc.webpack-china.org/guides/)好看多了, 于是还是选择跟着文档入门.

## 本地安装
运行以下命令之一, 可以安装最新版本或者执行的版本:
```zsh
npm install --save-dev webpack
npm install --save-dev webpack@<version>
```

官方不推荐安装全局的 `webpack`, 因为这样会锁定 `webpack` 的版本, 在使用不同版本的 `webpack` 项目中可能会构建失败.
```zsh
npm install -global webpack
```

## 起步
首先创建一个目录, 初始化以及在本地安装 `webpack`:
```zsh
mkdir webpack-demo && cd webpack-demo
npm init -y
npm install --save-dev webpack
```

然后在你的文件夹内, 会看到多了一个 `package.json` 文件, 然后要创建几个文件:

project
```shell
  webpack-demo
  |- package.json
+ |- index.html
+ |- /src
+   |- index.js
```

src/index.js
```js
function component() {
  var element = document.createElement('div');

  // Lodash (目前通过一个 script 脚本引入的)
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');

  return element;
}

document.body.appendChild(component());
```

index.html
```html
<html>
    <head>
        <title>Getting Started</title>
    </head>
    <body>
        <script src="https://unpkg.com/lodash@4.16.6"></script>
        <script src="./src/index.js"></script>
    </body>
</html>
```

这种方式是我们之前没有用打包工具时的做法, 这种方式有如下几个问题:
- index.js 没有显式的引入所依赖的 `Lodash`, 脚本执行依赖外部的扩展库.
- 如果依赖不存在或者引入顺序错误, 都会导致项目无法运行.
- 如果依赖被引入但是没有使用, 浏览器要被迫去下载无用的这个文件.

下面我们就用 `webpack` 来管理这些脚本.

### 创建 bundle 文件
将源代码和分发代码分离: 源代码(/src)是用于我们开发时编辑的代码; 分发代码(/dist)是构建后生成的最小化和优化的输出目录, 最终运行在浏览器的. 我们先调整一下项目目录:

project
```shell
  webpack-demo
  |- package.json
+ |- /dist
+   |- index.html
- |- index.html
  |- /src
    |- index.js
```

因为要在 `index.js` 中打包 `lodash` 依赖, 所以要先在本地安装 `lodash`:
```zsh
cnpm install --save lodash
```

然后在 `index.js` 中引入:

src/index.js
```js
import _ from 'lodash'
```

现在需要更新 `index.html`, 我们通过 `import` 的方式来引入 `lodash`, 所以可以将 lodash 的 `<script>` 标签删除了, 然后改成另一个 `<script>` 来加载 bundle, 而不是原来的 `/src` 文件.

index.html
```html
<body>
    <script src="bundle.js"></script>
</body>
```

### 使用配置文件
使用配置文件来减少在命令行中输入大量的命令, 那么首先就要创建一个配置文件:

project
```shell
  webpack-demo
  |- package.json
+ |- webpack.config.js
  |- /dist
    |- index.html
  |- /src
    |- index.js
```

webpack.config.js
```js
const path = require('path')

module.exports = {
    // 入口文件
    entry: './src/index.js',
    // 输出目录及打包的文件
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
}
```

package.json
```json
{
    ...
    "scripts": {
        "build": "webpack"
    },
    ...
}
```

现在我们就可以通过在命令行中输入 `npm run build` 来构建我们的项目了, 打开浏览器运行 `dist/index.html` 我们就可以在页面中看到 `hello webpack` 的字样了. 以下是我们现在的目录结构: 

project
```shell
webpack-demo
|- package.json
|- webpack.config.js
|- /dist
  |- bundle.js
  |- index.html
|- /src
  |- index.js
|- /node_modules
```

> 如果你使用的是 npm 5，你可能还会在目录中看到一个 package-lock.json 文件

到这里我们大概知道了如何开始使用 `webpack` 以及一个最基本的配置. 后面的 `asset` 会基于这个例子中的东西, 所以我把项目结构改了一下, 把这些放在 `asset` 目录中, 之后的每一个例子我都会创建一个新的文件夹来放置.

前往下一节 [资源管理](https://github.com/Caraws/webpack-demo/tree/master/asset)

### 目标

- [x] 资源管理(https://github.com/Caraws/webpack-demo/tree/master/asset)
- [x] 管理输出(https://github.com/Caraws/webpack-demo/tree/master/output)
- [x] 开发(https://github.com/Caraws/webpack-demo/tree/master/development)
- [x] 模块热替换(https://github.com/Caraws/webpack-demo/tree/master/hot-module-replacement)
- [x] TreeShaking(https://github.com/Caraws/webpack-demo/tree/master/tree-shaking)
- [x] 生产环境构建(https://github.com/Caraws/webpack-demo/tree/master/production)
- [x] 代码分离(https://github.com/Caraws/webpack-demo/tree/master/code-splitting)
- [x] 懒加载(https://github.com/Caraws/webpack-demo/tree/master/lazy-loading)
- [x] 缓存(https://github.com/Caraws/webpack-demo/tree/master/caching)
- [ ] 创建 Library(https://github.com/Caraws/webpack-demo/tree/master/author-libraries)
- [ ] Shimming(https://github.com/Caraws/webpack-demo/tree/master/shimming)
- [ ] 渐进式网络应用(https://github.com/Caraws/webpack-demo/tree/master/progressive-web-application)
- [ ] TypeScript(https://github.com/Caraws/webpack-demo/tree/master/typescript)

Created on 2017-1-18 by cara
