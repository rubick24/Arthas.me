---
title: 新浪微博登录第三方应用
date: 2017-10-28 15:33:39
---
通过观察网易云音乐使用微博登录时跳转的页面[应用授权-网易云音乐](https://api.weibo.com/oauth2/authorize?client_id=301575942&response_type=code&redirect_uri=http://music.163.com/back/weibo&forcelogin=true&scope=friendships_groups_read,statuses_to_me_read,follow_app_official_microblog)，在微博账号的输入栏被填写并失去焦点后，会发送一个到prelogin.php的请求，请求的url为

`https://login.sina.com.cn/sso/prelogin.php?entry=openapi&callback=sinaSSOController.preloginCallBack&su=MTEx&rsakt=mod&checkpin=1&client=ssologin.js(v1.4.18)&_=1509178064363`

其中请求参数`su`为base64编码的账号字符串，`_`为当前时间，这里用`int(time.time()*1000)`生成。

``` python
    def start_requests(self):
        username_quote = urllib.parse.quote_plus(self.username)
        username_base64 = base64.b64encode(username_quote.encode("utf-8"))
        su =  username_base64.decode("utf-8")
        prelogin_url = 'https://login.sina.com.cn/sso/prelogin.php?entry=openapi&callback=sinaSSOController.preloginCallBack&su=%s&rsakt=mod&checkpin=1&client=ssologin.js(v1.4.18)&_=%s' % (su,str(int(time.time())))
        return [scrapy.Request(prelogin_url,headers=self.headers,meta={"cookiejar": 1},callback=self.login_request)]
```

请求的返回结果为：
``` js
    sinaSSOController.preloginCallBack({
        "retcode":0,
        "servertime":1509178513,
        "pcid":"yf-db7f8e82296bf55717be22d63e61976356da",
        "nonce":"8GLRMV",
        "pubkey":"EB2A38568661887FA180BDDB5CABD5F21C7BFD59C090CB2D245A87AC253062882729293E5506350508E7F9AA3BB77F4333231490F915F6D63C55FE2F08A49B353F444AD3993CACC02DB784ABBB8E42A9B1BBFFFB38BE18D78E87A0E41B9B8F73A928EE0CCEE1F6739884B9777E4FE9E88A1BBE495927AC4A799B3181D6442443",
        "rsakv":"1330428213",
        "is_openlock":0,
        "showpin":1,
        "exectime":23
    })
```
使用以下代码将其中的参数转换为一个python的dict:
``` python
    res = response.text.replace("sinaSSOController.preloginCallBack", '')
    server_data = eval(res)
```
使用得到的`servertime`、`nonce`和`pubkey`参数得出RSA加密后的密码：
```python
    rsaPublickey = int(server_data['pubkey'], 16)
    key = rsa.PublicKey(rsaPublickey, 65537)
    message = str(server_data['servertime']) + '\t' + str(server_data['nonce']) + '\n' + str(self.password)
    message = message.encode("utf-8")
    passwd = rsa.encrypt(message, key)
    passwd = binascii.b2a_hex(passwd)
```

然后就可以发送登录请求了：
``` python
login_url = 'https://login.sina.com.cn/sso/login.php?client=ssologin.js(v1.4.18)&_=%s&openapilogin=qrcode' % str(int(time.time()))
scrapy.FormRequest(
    login_url,
    meta={'cookiejar': response.meta['cookiejar']},
    headers=self.headers,
    formdata={
        'entry':'openapi',
        'gateway':'1',
        'from':'',
        'savestate':'0',
        'useticket':'1',
        'pagerefer':'http://music.163.com/',
        'ct':'1800',
        's':'1',
        'vsnf':'1',
        'vsnval':'',
        'door':'',
        'appkey':'u6BYq',
        'su':self.get_su(),
        'service':'miniblog',
        'servertime':str(server_data['servertime']),
        'nonce':str(server_data['nonce']),
        'pwencode':'rsa2',
        'rsakv':str(server_data['rsakv']),
        'sp':passwd,
        'sr':'1366*768',
        'encoding':'UTF-8',
        'cdult':'2',
        'domain':'weibo.com',
        'prelt':'55',
        'returntype':'TEXT'
    },
    callback=self.authorize_request,
)
```

然后是对网易云音乐的授权，请求表单需要提供登录成功返回的`ticket`值：
``` python
def authorize_request(self,response):
        response_json = json.loads(response.text)
        authorize_url = 'https://api.weibo.com/oauth2/authorize'
        return scrapy.FormRequest(authorize_url,
            headers=self.headers,
            meta={'cookiejar': response.meta['cookiejar']},
            formdata={
                'action':'login',
                'display':'default',
                'withOfficalFlag':'0',
                'quick_auth':'false',
                'withOfficalAccount':'',
                'scope':'',
                'ticket':response_json['ticket'],
                'isLoginSina':'',
                'response_type':'code',
                'regCallback':'https://api.weibo.com/oauth2/authorize?client_id=301575942&response_type=code&redirect_uri=http://music.163.com/back/weibo&forcelogin=true&scope=friendships_groups_read,statuses_to_me_read,follow_app_official_microblog',
                'redirect_uri':'http://music.163.com/back/weibo',
                'client_id':'301575942',
                'appkey62':'u6BYq',
                'state':'',
                'verifyToken':'null',
                'from':'',
                'switchLogin':'0',
                'userId':'',
                'passwd':''
            },
            callback=do_something)
```
授权成功后会跳转到`http://music.163.com/back/sns`,返回了网易云音乐用户的uid和一些信息，大功告成~