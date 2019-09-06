---
title: 使用laravel/passport的客户端api认证
date: 2016-10-27 21:48:50
category: laravel
tags: [laravel]
---

### 根据官方文档安装passport

在执行`passport:install`时 passport已经创建了id为2的密码发放客户端;

### 用js消费api

用js请求`/oauth/token`来获取`access_token`和`refresh_token`;

``` js
login(e){
    e.preventDefault()
    var data = Object()
    data.grant_type = 'password',
    data.client_id = '2',
    data.client_secret = 数据库中的secret值,
    data.username = $("#username").val(),
    data.password = $("#password").val(),
    data.scope = '*'
    data = JSON.stringify(data)
    this.$http.post('/oauth/token',data).then((response) =>{
        console.log(response.data.access_token)
        Cookies.set('api_token',response.data.access_token)
    }, (response) => {
        console.log('获取失败')
    })
},
```

将获取到的api_token添加到header的`Authorization`中，

设置其值为`Bearer TOKEN`， 其中TOKEN是`api_token`的值，

其中 Bearer 表示令牌类型。

### 路由

在`routes/api.php`中添加
``` php
Route::get('/test',function (){
    return 'success';
})->middleware('auth:api');
```
### JS

``` js
test(e){
    e.preventDefault()
    this.$http.get('/api/test',{
        headers:{
            'Authorization' : 'Bearer '+ Cookies.get('api_token'),
        }
    }).then((response) =>{
        this.msg = response.data
    }, (response) => {
        this.msg = 'failed'
    })
},
```
