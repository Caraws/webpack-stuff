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

if (module.hot) {
    module.hot.accept('./print.js', () => {
        console.log('Accepting the updated printMe module!')

        document.body.removeChild(element)
        element = component(); 
        document.body.appendChild(element)
    });
}
