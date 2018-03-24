import _ from 'lodash'
import print from './print'

const component = () => {
    let element = document.createElement('div')
    // let button = document.createElement('button')
    // let br = document.createElement('br')

    element.innerHTML = _.join(['Hello', 'webpack'], ' ')
    // button.innerHTML = 'click me and look console'

    // element.onclick = e => import(/* webpackChunkName: 'print' */ './print').then(module => {
    //     let print = module.default
    //     print('hello print')
    // })

    element.onclick = print.bind(null, 'hello print!')
    
    // element.appendChild(br)
    // element.appendChild(button)

    return element
}

document.body.appendChild(component())