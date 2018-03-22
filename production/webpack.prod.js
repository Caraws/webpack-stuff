// 构建配置
const webpack = require('webpack')
// 合并工具
const merge = require('webpack-merge')
// 移除无引用代码的压缩工具
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin')
// 将 css 分割为单独的文件, 而不是合并在 bundle 中
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const common = require('./webpack.common')

module.exports = merge(common, {
    // 开启 source map
    devtool: 'source-map',
    plugins: [
        new UglifyjsWebpackPlugin({
            // 开启 source map
            sourceMap: true
        }),
        // 指定环境
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        // 最后css分离成啥样
        new ExtractTextWebpackPlugin('styles.css')
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextWebpackPlugin.extract({
                    fallback: 'style-loader',
                    // 导出成 CSS 模块
                    use: 'css-loader'
                })
            }
        ]
    }
})