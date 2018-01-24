const path = require('path')
const UglifyjsWebpackPulgin = require('uglifyjs-webpack-plugin')

module.exports = {
    entry: {
        app: './src/index.js'
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        // 删除无用代码
        new UglifyjsWebpackPulgin()
    ]
}