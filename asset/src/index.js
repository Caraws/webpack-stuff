import _ from "lodash"
import './index.css'
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

document.body.appendChild(component())

