---
title: 使用laravel/passport的客户端api认证
date: 2016-10-27 21:48:50
category: laravel
tags: [laravel]
---

### 根据官方文档安装 passport

在执行`passport:install`时 passport 已经创建了 id 为 2 的密码发放客户端;

### 用 js 消费 api

用 js 请求`/oauth/token`来获取`access_token`和`refresh_token`;

```js
login() {
  const data = {
    grant_type: 'password',
    client_id: 2,
    client_secret: 数据库中的secret值,
    username: $("#username").val(),
    password: $("#password").val(),
    scope: '*'
  }

  this.$http.post('/oauth/token', JSON.stringify(data))
    .then(response =>{
      console.log(response.data.access_token)
      Cookies.set('api_token',response.data.access_token)
    })
    .catch(console.error)
},
```

将获取到的 api_token 添加到 header 的`Authorization`中，

设置其值为`Bearer TOKEN`， 其中 TOKEN 是`api_token`的值，

其中 Bearer 表示令牌类型。

### 路由

在`routes/api.php`中添加

```php
Route::get('/test',function (){
    return 'success';
})->middleware('auth:api');
```

### JS

```js
test() {
  this.$http.get('/api/test',{
    headers:{
      'Authorization' : 'Bearer '+ Cookies.get('api_token'),
    }
  }).then(response =>{
    this.msg = response.data
  }, response => {
    this.msg = 'failed'
  })
},
```
