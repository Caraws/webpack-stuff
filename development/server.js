// express 服务
const express = require('express')
const webpack = require('webpack')
const WebpackDevMiddleware = require('webpack-dev-middleware')

// 起一个 express 服务
const app = express()
const config = require('./webpack.config')
const compiler = webpack(config)

app.use(WebpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
}))

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('express listening on ' + port)
})