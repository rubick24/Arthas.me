---
title: material-ui的使用
date: 2016-05-20 19:55:42
---
看前端框架的时候了解到了[material-ui](http://www.material-ui.com/#/),因为很喜欢这种简洁美观的设计，所以一直想尝试使用。但因为是基于react的，所以先学习了bootstrap，然后看了一些react的基础，才回来看这个。。

下面说一说具体的使用方法

首先，用`npm init`新建`package.json`文件，在项目目录下用npm安装 react、react-dom、react-tap-event-plugin 和 material-ui;

`npm install react react-dom react-tap-event-plugin material-ui`

`npm install -g webpack`

Webpack 的配置文件为 `webpack.config.js` ，要编译 JSX，先安装对应的 loader:
`npm install babel-loader babel-core babel-preset-es2015 babel-preset-react --save-dev`




创建入口文件`App.js`
``` js
import React from 'react';
import ReactDOM from 'react-dom';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MyAwesomeReactComponent from './MyAwesomeReactComponent';

const App = () => (
  <MuiThemeProvider muiTheme={getMuiTheme()}>
    <MyAwesomeReactComponent />
  </MuiThemeProvider>
);

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
```
接着是应用了material-ui的组件MyAwesomeReactComponent.js:
``` js
import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

const MyAwesomeReactComponent = () => (
  <RaisedButton label="Default" />
);
```

然后是webpack的配置文件`webpack.config.js`
``` js
var path = require('path');

module.exports = {
    entry: './App.js',
    output: {                                   // 打包到dist/bundle.js中
        path: path.join(__dirname, '/dist'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    presets: ['react', 'es2015']
                }
            }
        ]
    }
}
```
最后是效果的呈现页面`index.html`
``` html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>index</title>
</head>
<body>
<div id="app"></div>
<script src="dist/bundle.js"></script>
</body>
</html>
```
然后运行webpack命令 没有报错的话，打开index.html就能看到一个material-ui效果的按钮了！

网络问题可以使用cnpm或者给npm设置代理

`npm config set proxy http://127.0.0.1:1080`

下载完成后删除代理

`npm config delete proxy`

[Usage - Material-UI](http://www.material-ui.com/#/get-started/usage)
[React入门教程 — hui.liu](https://hulufei.gitbooks.io/react-tutorial/content/introduction.html)