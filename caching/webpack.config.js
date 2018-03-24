const path = require('path')
const Webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

exports.default = {
    entry: {
        app: './src/index.js',
        vendor: ['lodash']
    },
    output: {
        // 添加 chunkhash
        filename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'caching'
        }),
        new CleanWebpackPlugin(['dist']),
        // 保证 vendor 的 hash 不变
        new Webpack.HashedModuleIdsPlugin(),
        // 在 manifest 之前引入
        new Webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'
        }),
        // 提取样板
        new Webpack.optimize.CommonsChunkPlugin({
            name: 'manifest'
        })
    ]
}