// 入口文件
import _ from "lodash"
import printSome from "./print"
import './index.css'

function component () {
    let element = document.createElement('div')
    let btn = document.createElement('button')


    element.innerHTML = _.join(['hello', 'webpack'], ' ')

    btn.innerHTML = 'click me'
    btn.onclick = printSome

    element.appendChild(btn)
    return element
}
// document.body.appendChild(component());

console.log(2)

let element = component()
document.body.appendChild(element)

if (module.hot) {
    module.hot.accept('./print', function () {
        console.log('Accepting the updated printMe module!')
        // printSome()
        document.body.removeChild(element)
        element = component(); 
        document.body.appendChild(element)
    });
}

