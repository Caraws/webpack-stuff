// 入口文件
import { cube } from './math'
import './index.css'

if (process.env.NODE_ENV !== 'production') {
    console.log('这是开发环境')
}else {
    console.log('这是生产环境')
}

function component () {
    // let element = document.createElement('div')

    // element.innerHTML = 'Hello World!'
    // return element

    let element = document.createElement('pre')
    element.innerHTML = [
        'Hello Webpack!',
        '计算 5 的立方: ' + cube(5)
    ].join('\n\n')

    return element
}

document.body.appendChild(component())