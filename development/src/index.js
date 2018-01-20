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

document.body.appendChild(component())

