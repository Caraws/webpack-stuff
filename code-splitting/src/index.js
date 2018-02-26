/* import _ from 'lodash'

const getComponent = () => {
    let element = document.createElement('div')
    element.innerHTML = _.join(['Hello', 'webpack'], ' ')

    return element
}
document.body.appendChild(component()) */

const getComponent = () => {
    // 注释中使用 webpackChunkName 会让 lodash 被命名为 lodash.bundle.js 
    // 而不是 [id].bundle.js
    return import(/* webpackChunkName: 'lodash' */ 'lodash').then(_ => {
        let element = document.createElement('div')
        element.innerHTML = _.join(['Hello', 'webpack'], ' ')
        return element
    }).catch(err => 'An error occurred while loading the component')
}

getComponent().then(component => {
    document.body.appendChild(component)
})