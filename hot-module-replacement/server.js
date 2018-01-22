// express 服务
const express = require('express')
const webpack = require('webpack')
const WebpackDevMiddleware = require('webpack-dev-middleware')
const WebpackHotMiddleware = require('webpack-hot-middleware')

// 起一个 express 服务
const app = express()
const config = require('./webpack.config')
const compiler = webpack(config)


app.use(WebpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}))
// 热替换
app.use(WebpackHotMiddleware(compiler))


const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('express listening on ' + port)
})