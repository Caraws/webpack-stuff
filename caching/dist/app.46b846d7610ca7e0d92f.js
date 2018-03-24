webpackJsonp([1],{

/***/ "3Di9":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ((text) => {
    console.log('print.js: ' + text)
});

/***/ }),

/***/ "lVK7":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__("o/kp");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__print__ = __webpack_require__("3Di9");



const component = () => {
    let element = document.createElement('div')
    // let button = document.createElement('button')
    // let br = document.createElement('br')

    element.innerHTML = __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.join(['Hello', 'webpack'], ' ')
    // button.innerHTML = 'click me and look console'

    // element.onclick = e => import(/* webpackChunkName: 'print' */ './print').then(module => {
    //     let print = module.default
    //     print('hello print')
    // })

    element.onclick = __WEBPACK_IMPORTED_MODULE_1__print__["a" /* default */].bind(null, 'hello print!')
    
    // element.appendChild(br)
    // element.appendChild(button)

    return element
}

document.body.appendChild(component())

/***/ })

},["lVK7"]);