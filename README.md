# webpack多页面

## webpack是什么？
```
1、前端项目打包工具
2、主要功能就是，将一些浏览器不支持的拓展语言，转换成浏览器支持的语言，如typeScript，less，sass
```
## webpack能干什么
```
1、webpack能处理js、json资源，不能处理css、img等其它资源

2、webpack将一些ES6模块化语法（如：import from语句），编译成浏览器能运行的语法

3、处理css、less等其它资源，需要使用loader来处理
（loader主要就是帮助webpack解析，webpack不能解析的模块，如css模块）

```
## webpack打包模式
```
1、development   开发模式

2、production    生产模式

两者区别：webpack旧版本，生产模式比开发模式多了个代码压缩。最新版本，生产版本不光多个代码压缩，多了个，先运行了一遍代码，打包后的是运行后的结果

```
## loader与plugins
```
loader（加载器）webpack将文件视为模块，但是webpack原生是只能解析js，json文件，如果想解析，打包，其它文件的话，就会用到loader，所以loader的作用是让webpack拥有了加载和解析非js，json文件的能力

plugin（插件）plugin可以扩展webpack的功能，让webpack具有更多的灵活性，在webpack运行的生命周期中会广播出许多事件，plugin 可以监听这些事件，在合适的时机通过webpack提供的api改变输出结果
```

## webpack安装
```
npm install webpack -g  //全局安装
```
## webpack打包命令
```
webpack //在项目根目录运行这条命令
```
## 项目依赖安装
```
npm install
```
## 项目目录
```
┌ build //项目打包后文件夹
├ src ┌ pages ┌ page1 ┌ index.css
│     │       │       ├ index.html
│     │       │       └ index.js
│     │       └ page2 ┌ index.css
│     │               ├ index.html
│     │               └ index.js
│     └ static
├ .gitignore //git忽略配置文件
├ package.json
├ README.md //项目描述文件
└ webpack.config.js //webpack配置文件
```
