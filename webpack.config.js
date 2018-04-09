const isProd = process.env.NODE_ENV === 'prod';
let path = require('path'); // 引入path，解析相对路径
webpack = require('webpack');
HtmlWebpackPlugin = require('html-webpack-plugin');
MultipleHtmlPlugin = require('./config/multipleHtmlPlugin');
ExtractTextPlugin = require('extract-text-webpack-plugin');
OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {

    entry: isProd ? './config/webpack.entry.js' : [
        // 启动本地服务
        'webpack-dev-server/client?http://localhost:8080',

        // 给上面的本地服务开启自动刷新功能，'only-dev-server'意思只有当模块允许被热更新之后才有热加载
        'webpack/hot/only-dev-server',

        // 入口文件，必须写在上面两个之后，'webpack-dev-server'才有效
        './config/webpack.entry.js'
    ],

    // 定义webpack打包时的输出文件名及路径
    output: {
        // 定义webpack打包之后的文件名
        filename: 'bundle.js',

        // 定义打包文件的存储路径：当前目录的build文件夹
        path: path.resolve(__dirname, './build'),

        // 声明资源（js、css、图片等）的引用路径
        // webpack打包时会把html页面上的相对路径根据publicPath解析成绝对路径
        publicPath: isProd ? './' : ''
    },

    // 用于解析entry选项的基本目录（必须是绝对路径），该目录必须包含入口文件
    // 默认：process.cwd()
    context: __dirname,

    // 定义项目里各种类型模块的处理方式
    module: {
        rules: [
            {
                test: /\.css/,
                use: isProd ? ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: true
                            }
                        }, 'postcss-loader'
                    ]
                }) : ['style-loader', 'css-loader', 'postcss-loader']
            },
            {
                test: /\.scss$/,
                use: process.env.NODE_ENV === 'prod' ? ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    publicPath: '../',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: true
                            }
                        }, 'sass-loader', 'postcss-loader'
                    ]
                }) : ['style-loader', 'css-loader', 'sass-loader', 'postcss-loader']
            },
            {
                test: /\.(jpg|png|gif)$/,
                use: ['url-loader?limit=10&name=image/[name].[hash:7].[ext]']
            },
            {
                test: /.\.html$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        interpolate: 'require'
                    }
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            }
        ]
    },

    // webpack 插件
    plugins: isProd ? [

        // 生成html文件
        new MultipleHtmlPlugin(),

        new ExtractTextPlugin('css/style.css'),

        new webpack.DefinePlugin({
            'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),

        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: true
            }
        }),

        // 给打包文件加上你的签名
        new webpack.BannerPlugin({
            banner: 'Created by Seaton on ' + new Date()
        })
    ] : [

        // 生成html文件
        new MultipleHtmlPlugin(),

        // 开启webpack全局热更新
        new webpack.HotModuleReplacementPlugin(),

        // 当接收到热更新信号时，在浏览器console控制台打印更多可读性高的模块名称等信息
        new webpack.NamedModulesPlugin(),

        new webpack.DefinePlugin({
            'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),

        new OpenBrowserPlugin({
            url: 'http://localhost:8080'
        })
    ],

    // 定义webpack-dev-server
    devServer: {
        // 静态文件目录位置
        contentBase: path.resolve(__dirname, 'src'),

        host: '0.0.0.0',

        // 模块热更新
        hot: true,
        // 在命令行显示打包信息
        noInfo: true
    }

};