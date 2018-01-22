// webpack 配置文件
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const webpack = require('webpack')

module.exports = {
    /* entry: {
        app: './src/index.js',
        // print: './src/print.js'
    }, */
    context: __dirname,
    entry: [
        'webpack-hot-middleware/client?reload=true',
        './src/index.js'
    ],
    output: {
        // [name]将对应 entry 中的属性名
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        // 告诉 webpack-dev-middleware 在哪儿运行: localhost: 3000
        publicPath: '/'
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'this title from HtmlWebpackPlugin'
        }),
        // 热替换
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ],
    // 构建后的文件 debug
    devtool: 'inline-source-map',
    // 告诉 webpack-dev-server 在 localhost:8080 下建立服务
    // 将 './dist' 文件夹下的文件作为可访问文件
    devServer: {
        contentBase: './dist'
    }
}