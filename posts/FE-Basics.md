---
title: FE Basics
date: 2018-04-12 16:51:24
tags:
---

该会的要会呀


**check-list.txt**

```
# Get/Post {
    起始行（start line）
        request:  get  /a.txt HTTP/1.1
                header: Accept,Host
        response:  HTTP/1.1  200 OK
                header: Content-type, Content-length
    url长度 IE最长2048字符,Chrome/Apache Server为8182字节
    Get请求通常没有body
}

# HTTP status code

语义化标签 http://justineo.github.io/slideshows/semantic-html/#/

```
``` js
js  {
    # ==/=== {
        ==  相等     类型转换   值比较
        === 严格相等           类型和值比较
    }

    # null/undifined {
        Number(null)=0  Number(undefined)=NaN
        null表示"没有对象"，即该处不应该有值。
            （1） 作为函数的参数，表示该函数的参数不是对象。
            （2） 作为对象原型链的终点。
        undefined表示"缺少值"，就是此处应该有一个值，但是还没有定义。
            （1）变量被声明了，但没有赋值时，就等于undefined。
            （2) 调用函数时，应该提供的参数没有提供，该参数等于undefined。
            （3）对象没有赋值的属性，该属性的值为undefined。
            （4）函数没有返回值时，默认返回undefined。
    },

    # Array {
        map(element, index, array),
        reduce((pre,cur),init),
        filter/forEach/every/some
    }

    # prototype {
        Function.prototype,
        obj.__proto__ 原型链,
        .call(context,args), .bind(this)
    },

    # Promise {
        function timeout(ms) {
            return new Promise((resolve, reject) => {
                setTimeout(resolve, ms, 'args');
            });
        }
        timeout(1000).then((arg)=>{
            console.log(arg)
        })

        promise
        .then(result => {···})
        .catch(error => {···})
        .finally(() => {···});
    }

    数据绑定 {
        1.发布者-订阅者模式（backbone.js）
        2.脏值检查（angular.js）
        3.数据劫持（vue.js）
    }

    Proxy {
        var proxy = new Proxy(target, handler);
        handler {
            get(target, propKey, receiver)
            set(target, propKey, value, receiver)
        }
    }

    Reflact {
        //Object对象语言内部的方法
        Reflect.defineProperty(target, property, attributes)) //返回bool

    }

    观察者模式 {
        const queuedObservers = new Set();

        const observe = fn => queuedObservers.add(fn);
        const observable = obj => new Proxy(obj, {set});

        function set(target, key, value, receiver) {
            const result = Reflect.set(target, key, value, receiver);
            queuedObservers.forEach(observer => observer());
            return result;
        }
    }

    AMD/CommonJS,

    [...new Set([1,2,3,1,'a',1,'a'])] //去重

    正则 https://docs.python.org/3/library/re.html
    /^(\w+)(\.\w+)*@(\w+)(\.\w+)*.(\w+)$/i //邮箱reg

}

```
```
css {
    css selector

    盒子模型: content padding border margin
        border-sizing: border-box 宽高包括边框

    display: none block inline inline-block
        block 宽度填满父容器，可设置宽高，可以设置padding,margin //<div>,<p>
        inline 行内元素，padding,margin水平有效 //<a>,<span>,<img>
            把 li 元素修改成 inline，水平菜单。
        inline-block 水平方向排列block

    position:   static
                relative(相对原来位置偏移，不影响其他元素)
                fixed(相对于视窗来定位)
                absolute(对于最近的“positioned”祖先元素)
    flexbox
        父 display:flex;
        子 flex：1 在剩余宽度中占1份
            //flex=none,width=固定值 固定宽度

    float:
        float: right //向右浮动 环绕图片
        overflow: auto; //清除浮动

    @media:媒体查询
        and(与)   ,(或)   not(非)
        @media screen and (min-width:600px)
        @media screen and (max-width:599px)

    css变量声明  --foo: #7F583F;

    居中：
        flex：
            height: 300px;
            display: flex;
            align-items: center; /*垂直轴上居中，单行*/
            justify-content: center; /*水平轴上居中,行内*/
        垂直：
            1. 不知道自己高度和父容器高度
                父  position:relative;
                子  position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
            2.  子：display: inline-block; vertical-align: middle;

        行内元素：
            line-height:高度;
            text-align:center;
            vertical-align:middle;
        块元素：
            margin/padding值设置居中
            clac(50% - 10rem)计算数值 margin值为 父容器宽/高的50% 减去 自身宽/高的50%：
            margin:0 auto 左右居中
            父relative：
                偏移量50%+负margin值       top:50%; margin-top:-50px;
                偏移量50%+负50%translate值          transform:translateX(-50%);
                偏移量0+margin:auto       子元素absolute 子元素偏移量全部为0


    侧栏布局：
        1.position      父relative               侧absolute,width       主margin-left:width
        2.float         父overflow:auto清除浮动   侧float:left，width     主margin-left:width
        3.inlin-block   侧和主都display: inline-block， vertical-align: top，分别设置 % width
        4.flexbox       父display: flex;         侧width                主flex: 1;
}

```