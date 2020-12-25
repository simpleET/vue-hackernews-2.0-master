const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const {VueLoaderPlugin} = require('vue-loader')

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
    devtool: isProd
        ? false
        : '#cheap-module-source-map',
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/dist/',
        filename: '[name].[chunkhash].js'
    },
    resolve: {
        alias: {
            'public': path.resolve(__dirname, '../public')
        }
    },
    module: {
        noParse: /es6-promise\.js$/, // avoid webpack shimming process
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    compilerOptions: {
                        preserveWhitespace: false
                    }
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.styl(us)?$/,
                use: isProd
                    ? ExtractTextPlugin.extract({ // 提取 css webpack4 丢弃-> mini-css-extract-plugin
                        use: [
                            {
                                loader: 'css-loader',
                                options: {minimize: true}
                            },
                            'stylus-loader'
                        ],
                        fallback: 'vue-style-loader'
                    })
                    : ['vue-style-loader', 'css-loader', 'stylus-loader']
            },
        ]
    },
    performance: {
        hints: false
    },
    plugins: isProd
        ? [
            new VueLoaderPlugin(),
            new webpack.optimize.UglifyJsPlugin({
                compress: {warnings: false}
            }),
            new webpack.optimize.ModuleConcatenationPlugin(),
            // 分离css   webpack4 已经丢弃,用新的api   MiniCssExtractPlugin()
            new ExtractTextPlugin({
                filename: 'common.[chunkhash].css'
            })
        ]
        : [
            new VueLoaderPlugin(),
            new FriendlyErrorsPlugin()
        ]
}
