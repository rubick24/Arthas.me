---
title: Retro Pixel Button
date: 2018-03-08 21:30:31
tags:
---

看了毛星云大神的 Unity Shader 编写教程，虽然过程中有点懵逼，但基本还是实现了一个简单的 Cel Shader， 接下来是研究下怎么实现和应用 Deferred Shading 吧

过程中发现我之前画的法线图并不好用。。
了解到一个叫[SpriteIlluminator](https://www.codeandweb.com/spriteilluminator)的软件，
感觉它的 Angle Brush 功能很有用，但不需要专门购买这个软件，自己做一张法线角度图取色用也可以。

![Normal Angle](img/normal-angle.png)

然后是突发奇想，在 HTML 里实现些像素风的 UI，所以就先从 Button 开始动手。
考虑了用 SVG 或者 Canvas 实现，还试了下用 Canvas，但感觉不够简洁，而且因为不是标准的 Button，功能还得自己实现，所以放弃了，改用 CSS 切换图片。

<iframe src="/demo/pixel-button/index.html" style="width:100%;height:300px" frameborder="0" scrolling="no"></iframe>

Edge 和 IE 中不支持`image-rendering: pixelated;`属性， 所以边框图实际使用时可能需要导出高分辨率的边框图以在这两个浏览器上获得较好的效果。
