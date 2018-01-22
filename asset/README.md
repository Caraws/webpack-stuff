# webpack 资源管理
这个小例子来展示如何加载资源

### 加载 CSS
要从一个 JavaScript 模块中引入一个 CSS 文件, 我们需要用到 [style-loader](https://doc.webpack-china.org/loaders/style-loader) 和 [css-loader](https://doc.webpack-china.org/loaders/css-loader), 所以先安装一下:

```zsh
npm install --save-dev style-loader css-loader
```
webpack.config.js
```js
// 在 module.exports 中添加属性
module: {
    rules: [
        {
            // 根据正则表达式来匹配哪些文件使用 loader
            test: /.css$/,
            use: [
                'style-loader',
                'css-loader'
            ]
        }
    ]
}
```

然后来试试, 在 `/src` 文件夹中新建一个 `index.css`

src/index.css
```css
.hello {
    color: green;
}
```

src/index.js 中, 添加:
```js
...

import './index.css'

function component () {
    let element = document.createElement('div')
    element.innerHTML = _.join(['hello', 'webpack'], ' ')
    element.classList.add('hello')

    return element
}

...

```
运行 `npm run build` 在浏览器中, 你应该就看到字体变成绿色了

### 加载图片
处理图片我除了官方文档用的 [file-loader](https://doc.webpack-china.org/loaders/file-loader), 我还跟着 `Vue.js` 用的[url-loader](https://doc.webpack-china.org/loaders/url-loader), 两者功能类似, 但是在文件大小低于指定值的时候可以返回一个 DataURL. 还是先安装吧:
```zsh
npm install --save-dev url-loader
```

webpack.config.js
```js
rules: [
    {
        ...
    },
    // 匹配图片
    {
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: 'url-loader',
        options: {
            // 图片大小小于这个值, 就会用 DataURL
            limit: 1024
        }
    }
]
```

src/index.js
```js
...

import icon from './icon.jpeg'

function component () {
    let element = document.createElement('div')
    element.innerHTML = _.join(['hello', 'webpack'], ' ')
    element.classList.add('hello')

    let img = new Image();
    img.src = icon
    element.appendChild(img)
    return element
}

...

```

再次打包后, 就会看到图片了, 再看看 `dist/` 中的图片的文件名就变成了类似 `ae92a8ebd5d3d01c143f75da04660d8e.jpg` 这样. 其他资源文件处理都是这样, 只要匹配响应的 loader 就行了, 我就不再一一列举了.

下一节 [管理输出](https://github.com/Caraws/webpack-demo/tree/master/output)

Created on 2017-1-18 by cara