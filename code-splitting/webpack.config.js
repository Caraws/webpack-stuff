const path = require('path')
// const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
    entry: {
        app: './src/index.js',
        // another: './src/another-module.js',
        // vendor: ['lodash']
    },
    output: {
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Code Splitting'
        }),
        new CleanWebpackPlugin(['dist']),
        /* new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            // 随着模块越来越多, 这个配置可以保证没有其他模块
            // 会打包进 vendor chunk
            minChunks: Infinity
        }) */
    ]
}