const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //这个插件，可将css提成文件，而不是把css放进html里
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

//webpack配置
module.exports = {
    //入口文件
    entry: {
        "page1": "./src/pages/page1/index.js",
        "page2": "./src/pages/page2/index.js",
        /*问：这里为什么要把html和css文件添加到入口文件这里？
        答：为了，在开发时，修改文件内容后，浏览器内容能实时更新，
        webpack的devServer仅监听，入口文件，的变化。而且想实现修改文件后，
        浏览器自动刷新，还需要在derServer的配置里写一个，watchFials属性，二者缺一不可。
        默认情况下，如果这里不写html和css，只写页面入口js文件的话，只有修改js文件时，浏览器才会自动刷新
        */
        "page1.html": "./src/pages/page1/index.html",
        "page1.css": "./src/pages/page1/index.css",
        "page2.html": "./src/pages/page2/index.html",
        "page2.css": "./src/pages/page2/index.css",
    },
    //输出
    output: {
        //输出文件名   [name] 为 entry 中的 key 如page1:...中的page1
        filename: 'js/[name]_[hash:6].js', //输出到build文件下，js文件夹内
        //输出路径
        path: path.join(__dirname, 'build'),
    },
    //loader 加载器，非js json文件，需要配置loader，来处理
    module: {
        rules: [{
                test: /\.css$/i, //处理已.css结尾的文件
                //使用那些loader进行处理
                use: [ //use数组中loader执行顺序，从右到左，从下到上执行
                    { //将css样式写到css文件里，这个区别style-loader，style-loader是将css写进html-head内
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            esModule: false
                        }
                    },
                    //"style-loader",//创建style标签，将js里的css字符串，添加到head里
                    "css-loader" //将css转成js字符串
                ]
            },
            {
                //file-loader 和 url-loader 负责，处理css里的图片资源，其中url-loader包含file-loader
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                // webpack 5最新处理方式，这种方式是webpack5自身内置的功能
                // type: 'asset/resource',
                // generator: {
                //     filename: 'images/[hash:10][ext][query]'
                // }
                // webpack 旧版处理方式，webpack5处理图片时，现在不建议再用url-loader 和 file-loader来处理了，如果坚持用，需要加type: 'javascript/auto' 和 esModule: false
                use: [{
                    loader: 'url-loader',
                    options: {
                        outputPath: "images",
                        name: "[hash].[ext]",
                        limit: 1024 * 8, //单位byte，当图片小于8kb，将图片转换成base64码
                        esModule: false //因为url-loader 和 file-loader是es6标准，不是commonjs标准
                    }
                }],
                type: 'javascript/auto' // webpack5处理图片时，现在不建议再用url-loader 和 file-loader来处理了，如果坚持用，需要加上type: 'javascript/auto'
            },
            {
                // html-loader可以处理html中的img图片，可负责将其中的图片引入，然后交由url-loader进行解析
                test: /\.html$/i,
                loader: 'html-loader',
                options: {
                    esModule: false
                },
                type: 'javascript/auto'
            },
            {
                //打包其它资源（除了html/js/css/less等以外的资源，如字体文件,音频文件，视频文件等）
                exclude: /\.(css|less|sass|html|js|json|png|svg|jpg|jpeg|gif)$/,
                loader: 'url-loader',
                options: {
                    outputPath: "static",
                    limit: 1024 * 8, //单位byte，当图片小于8kb，将文件转换成base64码
                    esModule: false
                },
                type: 'javascript/auto'
            }
        ]
    },
    //插件
    plugins: [
        new CleanWebpackPlugin(), //重新构建时，会自动清除，output.path路径内的文件
        new MiniCssExtractPlugin({ //将css提取成文件，需要配合loader一起使用，详细看文档
            linkType: "text/css",
            filename: "css/[name]-[contenthash:6].css"
        }),
        new HtmlWebpackPlugin({
            //网页的小icon
            favicon: "./src/static/favicon.ico",
            //指定html模板
            template: "./src/pages/page1/index.html",
            //输出的html文件名
            filename: "page1.html",
            //指定js入口文件，entry中的key
            chunks: ['page1'],
            // 开启模块热更新HMR
            hot: true
        }),
        new HtmlWebpackPlugin({
            //网页的小icon
            favicon: "./src/static/favicon.ico",
            //指定html模板
            template: "./src/pages/page2/index.html",
            //输出的html文件名
            filename: "page2.html",
            //指定js入口文件，entry中的key
            chunks: ['page2'],
            // 开启模块热更新HMR
            hot: true
        }),
    ],
    //开发服务器devServer，特点，只会在内存中编译打包，不会有任何输出，可以（自动编译，自动打开浏览器，自动刷新浏览器等）
    //启动devServer指令：npx webpack serve
    devServer: {
        static: path.join(__dirname, 'build'), //项目打包后的目录地址

        hot: true,

        compress: true, //启动gzip压缩

        port: 3000, //端口号

        open: true, //自动打开浏览器

        watchFiles: [
            "./src/pages/page1/index.html",
            "./src/pages/page1/index.css",
            "./src/pages/page2/index.html",
            "./src/pages/page2/index.css"
        ],
    },
    //performance: {}出现下面这个，是为了解决，webpack检测到，打包出来的文件体积太大，报警告的问题（这样写，是为了提高报错门槛）
    performance: {
        hints: "warning",
        maxAssetSize: 300000, // 整数类型（以字节为单位）
        maxEntrypointSize: 500000, // 整数类型（以字节为单位）
        assetFilter: function(assetFilename) {
            // 只给出js与css文件的性能提示
            return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
        }
    },
    //打包模式
    mode: 'development', //development 开发模式   production 生产
}