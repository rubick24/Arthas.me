---
title: '设置自定义域名邮箱'
date: 2023-12-29 17:52:00
---

原来一直用的是腾讯的域名邮箱，在 20 年初时下线了，就换成了企业微信的企业邮箱，即麻烦又有各种莫名其妙的拦截。

Cloudflare 的 Email Routing 服务推出时了解了一下，发现只有接收功能就没用换。但最近再看，找到一个用 gmail 的 SMTP 服务发送自己域名邮件的方案，试了下体验不错，遂有此分享。

首先需要把网站托管在 Cloudflare, 用了很久了不具体介绍了。

然后在 Cloudflare 的管理平台配置 email routing, 根据指引添加 dns 记录，开启邮件路由功能，添加邮箱地址。这里配完就能通过此地址收到邮件了。

然后是发送部分

1. 首先需要更新 dns 记录中 SPF TEXT 记录，添加 `include:_spf.google.com ` ：

```
v=spf1 include:_spf.mx.cloudflare.net include:_spf.google.com ~all
```

2. 然后你的 google 账号需要[开启两步验证](https://myaccount.google.com/signinoptions/two-step-verification),
3. 接下来需要创建一个用于 gmail 发送邮件的应用专用密码：[Create an App Password](https://security.google.com/settings/security/apppasswords)
4. 然后在 gmail 的设置中“查看所有设置” -> “账号和导入”tab -> “添加其他电子邮件地址”。填写表单,电子邮箱地址为你要发邮件的域名邮箱地址，SMTP 服务器为 `smtp.gmail.com`，端口为 `587`，用户名为你的 gmail 地址，密码粘贴前面创建的应用专用密码，保持默认的使用 TSL 链接，点击“添加账号”。

然后 gmail 会向你的域名邮箱发一封邮件，点击邮件里的链接验证后就能通过 gmail 发送域名邮箱地址的邮件了。

## Reference

[https://community.cloudflare.com/t/solved-how-to-use-gmail-smtp-to-send-from-an-email-address-which-uses-cloudflare-email-routing/382769](https://community.cloudflare.com/t/solved-how-to-use-gmail-smtp-to-send-from-an-email-address-which-uses-cloudflare-email-routing/382769)
