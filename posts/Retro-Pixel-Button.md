---
title: Retro Pixel Button
date: 2018-03-08 21:30:31
tags:
---

 看了毛星云大神的Unity Shader编写教程，虽然过程中有点懵逼，但基本还是实现了一个简单的Cel Shader， 接下来是研究下怎么实现和应用Deferred Shading吧

 过程中发现我之前画的法线图并不好用。。了解到一个叫[SpriteIlluminator](https://www.codeandweb.com/spriteilluminator)的软件，感觉它的Angle Brush功能很有用，但不需要专门购买这个软件，找一张合适的法线角度图，在PS里取色来画应该也行。

![Normal Angle](../static/img/normal-angle.png)


 然后是突发奇想，在HTML里实现些像素风的UI，所以就先从Button开始动手。考虑了用SVG或者Canvas实现，还试了下用Canvas，但感觉不够简洁，而且因为不是标准的Button，功能还得自己实现，所以放弃了，改用CSS切换图片。

<iframe src="/demo/pixel-button/index.html" style="width:100%;height:300px" frameborder="0" scrolling="no"></iframe>

Edge和IE中不支持`image-rendering: pixelated;`属性， 所以边框图实际使用时可能需要导出高分辨率的边框图以在这两个浏览器上获得较好的效果。