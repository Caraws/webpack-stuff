// webpack 配置文件
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
    entry: {
        app: './src/index.js',
        print: './src/print.js'
    },
    output: {
        // [name]将对应 entry 中的属性名
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'this title from HtmlWebpackPlugin'
        }),
        // 再加一个
        new HtmlWebpackPlugin({
            title: 'Custom template',
            template: 'my-index.html'
        })
    ]
}