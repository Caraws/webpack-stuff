# Tree Shaking
Tree Shaking 通常用于描述移除 JavaScript 上下文中未引用代码, 以达到减少项目体积的目的. 他依赖于 ES6 模块系统中的静态结构特性, 例如 `import` 和 `export`.

这个小节的内容用 `起步` 时的代码, 结构如下:

```shell
tree-shaking
|- package.json
|- webpack.config.js
|- /dist
  |- bundle.js
  |- index.html
|- /src
  |- index.js
|- /node_modules
```

首先创建一个通用文件 `math.js`, 导出两个函数

src/math.js
```js
export function square (x) {
    return x * x
}

export function cube (x) {
    return x * x * x
}
```

src/index.js
```js
import { cube } from './math'

function component () {
    let element = document.createElement('div')

    element.innerHTML = [
        'Hello Webpack!',
        '计算 5 的立方 ' + cube(5)
    ].join('\n\n')

    return element
}

document.body.appenChild(component())
```

webpack.config.js 跟 `起步` 中一样保持不变
```js
const path = require('path')

module.exports = {
    entry: {
        app: './src/index.js'
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
}
```

运行 `npm run build` 开始构建, 检查 `dist/bundle.js` 大约在 90 ~ 100 行左右可以看到我们原本 `math.js` 模块中的内容, 发现我们没有用到的函数 `square` 还是存在于最终的文件中. 那么当项目有一定大小时, 如果能自动删除这些无用的代码便可以大大减少项目体积, 为了解决这个问题于是引入 [UglifyJsPlugin](https://doc.webpack-china.org/plugins/uglifyjs-webpack-plugin) 它是一个可以移除无引用代码和压缩的工具.

### UglifyJsPlugin 精简代码

安装
```zsh
npm install --save-dev uglifyjs-webpack-plugin
```

webpack.config.js
```js
// ...
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    // ...
    plugins: [
        new UglifyjsWebpackPlugin()
    ]
}
```

再次运行 `npm run build`, 现在可以看到 `dist/bundle.js` 已经被压缩过了, 仔细看最后可以发现我们没引用的 `square` 函数也被移除了.

#### 注意
webpack 本身是不会执行 Tree Shaking 的, 它需要依赖于第三方工具, 比如 UglifyJS. 还有一些情况下 Tree Shaking 也不会生效, 比如下面的例子这样:

transforms.js
```js
import * as lib from 'lib'
export const bar = lib.transform({
    // ...
})

export const foo = lib.transform({
    // ...
})
```

index.js
```js
import { bar } from './transform'

// 使用 bar 函数
```

像上面这种情况 webpack 不能确定调用 `lib.transform` 会不会有副作用, 所以为了保险起见不会移除 `foo`. 常见的情况基本是: 从第三方模块中调用一个函数, webpack 或者 UglifyJS 无法检查此模块; 从第三方模块导入的函数又被重新导出, 等等...

**使用 Tree Shaking 必须要满足以下两点:**

- 使用 ES6 模块语法: `import`/ `export`
- 引入能够删除无引用代码的第三方压缩工具, 如: `UglifyJS`

前往下一节 [构建生产环境](https://github.com/Caraws/webpack-demo/tree/master/production)

Created on 2017-1-23 by cara
