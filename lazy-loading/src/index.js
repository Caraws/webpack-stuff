// const getComponent = async () => {
//     // 既然 import返回的是 Promise 那么也可以跟 async/await 配合使用
//     let element = document.createElement('div')
//     const _ = await import(/* webpackChunkName: 'lodash' */ 'lodash')
//     element.innerHTML = _.join(['Hello', 'webpack'], ' ')
//     return element
// }

// getComponent().then(component => {
//     document.body.appendChild(component)
// })

import _ from 'lodash'

const component = () => {
    let element = document.createElement('div')
    let button = document.createElement('button')
    let br = document.createElement('br')

    element.innerHTML = _.join(['Hello', 'webpack'], ' ')
    button.innerHTML = 'click me and look console'
    element.appendChild(br)
    element.appendChild(button)

    button.onclick = e => import(/* webpackChunkName: 'print' */ './print').then(module => {
        let print = module.default
        print()
    })

    return element
}

document.body.appendChild(component())


