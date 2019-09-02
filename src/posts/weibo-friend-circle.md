---
title: 新浪微博用户好友圈
date: 2018-04-12 17:03:01
tags:
---

[wbzz.arthas.me(微博好友圈查询)](https://wbzz.arthas.me/)

![查询结果截图](img/wbzz.png)

后端：[Deadalusmask/WBzz-api](https://github.com/Deadalusmask/WBzz-api)

前端：[Deadalusmask/WBzz-client](https://github.com/Deadalusmask/WBzz-client)

后端接口分为`/api/user`和`/api/uid`两个,分别接受用户昵称和用户 uid 为参数，在收到请求后进行爬虫，并返回 json 格式结果，没有将数据储存。用的是`m.weibo.com`的数据接口，其中没有地址信息，所以需要地址信息的话还得再请求一遍 PC 版网页，耗时较长。

前端用了 Vue.js, vue-cli 提供的模板挺好用的，也顺便研究了下这个模板的结构。然后除了请求库 axios 外没有再用别的组件库，反正页面简单，样式也容易写。

每个用户显示的信息还可以加点关注数、粉丝数什么的。
不知道有没有不要 APP_KEY 就能用的可以直接返回带地址信息的用户数据接口，有的话查询时间就快多了。
