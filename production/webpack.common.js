// 公共配置
const path = require('path')
// 每次构建清除旧文件, 重新生成
const CleanWebpackPlugin = require('clean-webpack-plugin')
// 动态创建 html 文件
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: {
        app: './src/index.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'Production'
        })
    ]
}