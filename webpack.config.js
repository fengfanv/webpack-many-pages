const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //这个插件，可将css提成文件，而不是把css放进html里

//webpack配置
module.exports = {
    //入口文件
    entry: {
        page1: "./src/pages/page1/index.js",
        page2: "./src/pages/page2/index.js"
    },
    //输出
    output: {
        //输出文件名   [name] 为 entry 中的 key 如page1:...中的page1
        filename: 'js/[name]/index.js', //输出到build文件下，js文件夹内
        //输出路径
        path: path.join(__dirname, 'build'),
    },
    //loader 加载器，非js json文件，需要配置loader，来处理
    module: {
        rules: [{
                test: /\.css$/, //处理已.css结尾的文件
                //使用那些loader进行处理
                use: [ //use数组中loader执行顺序，从右到左，从下到上执行
                    //创建style标签，将js里的css字符串，添加到head里
                    "style-loader",
                    //将css转成js字符串
                    "css-loader"
                ]
            },
            {
                //处理图片资源，这个有一个缺点，就是不处理html中img标签引用的资源，只处理css里的图片资源
                test: /\.(jpg|png|gif)$/,
                //使用url-loader，需要下两个包，一个是url-loader，还有一个是file-loader
                loader: 'file-loader',
                //这个loader的配置
                options: {
                    //limit意思，图片大小小于8kb，就会被base64处理
                    //优点：减少请求数量（减轻服务器压力）
                    //缺点：图片体积会更大（文件请求速度更慢）
                    //打包结果，一开始有两个图片，一个是500kb的，另一个是4kb的，打包后，4kb的会被转为base64
                    // limit: 8 * 1024,
                    name: 'static/[name].[ext]',
                    esModule: false, //不显示图片问题，这个是原因url-loader、file-loader都是采用es6语法规范的，而不是commonjs规范，由于url-loader、file-loader中可以通过esModule属性来选择是否关闭es6语法规范,加esModule: false 和 type: 'javascript/auto' 解决打包后css里图片资源路径不正确的问题
                },
                type: 'javascript/auto'
            },
            {
                test: /\.html$/,
                // html-loader可以处理html中的img图片，可负责将其中的图片引入，然后交由url-loader进行解析
                loader: 'html-loader',
                options: {
                    esModule: false
                },
                type: 'javascript/auto'
            },
            {
                //打包其它资源（除了html/js/css/less等以外的资源）
                exclude: /\.(css|less|html|js|json|jpg|png|gif)$/,
                loader: 'url-loader',
                type: 'javascript/auto'
            }
        ]
    },
    //插件
    plugins: [
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
    //开发服务器devServer，只会在内存中编译打包，不会有任何输出
    //启动devServer指令：npx webpack serve
    devServer: {
        //项目打包后的目录地址
        static: path.join(__dirname, 'build'),
        //启动gzip压缩
        compress: true,
        //端口号
        port: 3000,
        //自动打开浏览器
        open: true
    },
    //打包模式
    mode: 'production', //development 开发模式   production 生产
}