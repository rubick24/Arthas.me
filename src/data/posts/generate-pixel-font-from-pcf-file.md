---
title: '从PCF字体文件生成矢量像素字体'
date: 2022-4-25 18:23:00
---

## 用于现代浏览器显示的像素字体

早期的计算机系统使用位图字体显示文字，一个字形的位图数据可以理解为一个固定宽高的二维数组，其中每一个元素为 0 或者 1 ，表示这个位置是否属字形中。位图字体文件有文本格式的 [BDF](https://www.adobe.com/content/dam/acom/en/devnet/font/pdfs/5005.BDF_Spec.pdf) 和二进制格式的 [PCF](https://fontforge.org/docs/techref/pcf-format.html)。但由于显示技术的进步，位图字体在高分辨率的显示设备下非整数倍缩放时无法清晰显示，且对于常规字体，放大还会导致字形的锯齿边缘明显。现在，TrueType Font 已经取代了位图字体成为主流的字体格式，它使用类似 svg path commands 的数据格式，描述了每个字符的矢量形状。

现代浏览器只支持 TTF 格式字体以及将 TTF 字体为 web 封装的 WOFF 格式字体，且不支持展示 TTF 字体中嵌入的 bitmap 数据。所以在浏览器上开发像素风游戏，在有使用像素风字体的需求时，就只能寻找矢量字形的像素风 TTF 字体。但现有的可选项并不多，较为知名的有 [Zpix](https://github.com/SolidZORO/zpix-pixel-font) 以及 [丁卯点阵体](https://3type.cn/fonts/dinkie_bitmap/index.html)，但使用时都有一定的版权问题。

于是我找到了 [凤凰点阵体](https://timothyqiu.itch.io/vonwaon-bitmap)，这个项目将 DOS 时期的位图字体用 FontForge 脚本转成了矢量字形，但字数不够全，只有 7543 个字符，所以我又找到了包含 30165 个字符的 [文泉驿点阵宋体](http://wenq.org/wqy2/index.cgi?BitmapSong)，从官网下载了其 PCF 字体文件，尝试将其转换成矢量字形字体。

## FontForge Python 脚本还是 JS

一开始根据凤凰点阵体作者的介绍，打算使用 FontForge 执行 python 脚本来实现的，可惜折腾了半天，外部的 python 无法引入 fontforge 库，fontforge 提供的 ffpython 无法引入其他第三方库，快四年没接触 python，也不太熟悉了，遂放弃改用 js 来写。好在之前了解过一个 npm 包叫 `OpenType.js`，提供了 ttf 文件的读写和创建、修改字形等接口，帮我省下了一半的功夫。

## PCF 字体文件解析

只能说位图字体确实是要被时代淘汰的技术了，比较正式的 pcf 文件格式规范找了一圈只有 [FontForge 文档里的](https://fontforge.org/docs/techref/pcf-format.html)还可以，文件中一些用到的数据表如下：

- PCF_PROPERTIES：一些字体的全局属性
- PCF_ACCELERATORS：一些字体的全局属性
- PCF_BITMAPS：字形数据
- PCF_BDF_ENCODINGS：字符编码和字形的对应关系
- PCF_GLYPH_NAMES：字形名称
- PCF_METRICS：每个字形的指标数据，包含其在基线上下方的高度

数据存储方式是大端序还是小端序还是根据配置的格式来的，不清楚当时为什么会设计的这么复杂。

以大写字母 `A` 为例，先从 `PCF_BDF_ENCODINGS` 表中查到其在 `PCF_BITMAPS` 表中的索引为 `35`：

```js
const bitmapIndex = tables['PCF_BDF_ENCODINGS'].glyphIndices[65] // 35
```

再从 `PCF_BITMAPS` 表中读取其位图数据如下：

```js
const bitmapData = [0x1000, 0x1000, 0x2800, 0x2800, 0x4400, 0x7c00, 0x8200, 0x8200]
```

将其转换为 2 进制字符串，`0` 替换为 `_`，`1` 替换为 `#`，即可看出字形：

```js
const binaryStr = [
  '________________',
  '___#____________',
  '___#____________',
  '__#_#___________',
  '__#_#___________',
  '_#___#__________',
  '_#####__________',
  '#_____#_________',
  '#_____#_________'
]
```

## 位图数据转换成矢量数据

在拿到位图数据后，需要将其转换为用 SVG 的 [path_commands](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d#path_commands) 描述的矢量数据。

需要注意的是，TrueType 字体的 [填充方式](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Attribute/fill-rule) 指定为 `nonzero`，简单来说就是 “口” 这种两个封闭环形组成的形状，外层环形和内层环形的环绕方向必须相反，一个顺时针，另一个就必须是逆时针才能让中间变成空心的。
（经测试在 chrome 里会使用 `evenodd` 填充规则，相同方向也是可以正常显示的，但对于更老一些的渲染引擎，比如 FontForge 中，会展示为实心）

下图中左侧为不同方向，右侧为相同方向：

![FontForge中的“口”字展示](/img/kou.png)

## 具体的实现思路

每个像素点有 4 个边，2 条横边和 2 条竖边，每条边最终只有两种状态：是字形边缘或不是字形边缘；

在一个宽高 `m * n` 的位图中，共有 `m * (n + 1)` 条横边和 `(m + 1) * n` 条竖边, 对应初始化两个二维数组 `rows` 和 `columns` 并填充为 `0`,意为此边还不是字形的边缘；

对于像素点 `(i, j)`，其对应的四条边为 `rows(i, j)`、`rows(i, j + 1)`、`columns(i, j)`、`rows(i + 1, j)`；

所以可以遍历每个像素点，如果这个点的值为`1`，就更新它的四条边的状态 `v => 1 - v`，遍历结束后所有值为`1`的边就是字形的边；

我们假定在画边时，前进方向的左边为字形内部，右边为字形外部。那么对于所有的横边来说，上方是内部下方是外部时，应该从右向左前进，反之从右向左，对于所有的竖边来说，左边时内部右边时外部时应向上前进，反之向下。

所以我们可以再次遍历所有的字形的边，计算其前进方向，并把所有**前进方向和坐标轴方向相反**的边标记为 `2`。

在得到所有的边和边的方向后，我们就可以遍历所有的顶点，从每个未遍历过的顶点出发，向可以前进的边遍历。在每次新加 `L` 指令时，判断如果上一次也是`L`指令且方向一致，那么上一个指令就可以被省略掉，节约一个顶点数据。

用上述方法得到的字母 A 的形状如下：

```
M0 0L0 200L100 200L100 400L200 400L200 600L300 600L300 800L400 800L400 600L500 600L500 400L600 400L600 200L700 200L700 0L600 0L600 200L100 200L100 0L0 0M200 300L500 300L500 400L400 400L400 600L300 600L300 400L200 400L200 300Z
```

绘制为 svg：
<svg viewBox="0 0 800 800" style="display: block;width: 200px;height: 200px;fill: currentColor;transform: scaleY(-1);margin: 0 auto;">
<path d="M0 0L0 200L100 200L100 400L200 400L200 600L300 600L300 800L400 800L400 600L500 600L500 400L600 400L600 200L700 200L700 0L600 0L600 200L100 200L100 0L0 0M200 300L500 300L500 400L400 400L400 600L300 600L300 400L200 400L200 300Z"/>
</svg>

## 生成字体文件

在得到每个字符的 path 后，生成 OpenType.js 中的 Glyph 对象：

```js
const glyph = new opentype.Glyph({
  name: tables['PCF_GLYPH_NAMES'].names[v],
  unicode: i,
  advanceWidth: tables['PCF_METRICS'].metrics[v].character_width * scale,
  path: genPath(v)
})
```

然后再用这些 Glyph 新建 `opentype.Font`

```js
const accelerator = tables['PCF_ACCELERATORS']
const ascent = accelerator.fontAscent
const descent = accelerator.fontDescent
const fontHeight = ascent + descent
const font = new opentype.Font({
  familyName: 'MyPixelFont',
  styleName: 'Medium',
  unitsPerEm: fontHeight * scale,
  ascender: ascent * scale,
  descender: -descent * scale,
  glyphs: glyphs
})
```

最后调用 `font.download()` 即可将转换后的字体保存在当前目录。

在字符数过多时生成的字体文件会有错误，在 FontForge 中重新导出后正常，具体原因待排查。

生成的字体在 chrome 中的实际效果：
![generated font example](/img/generated-font.png)

## 项目代码

[https://github.com/Deadalusmask/pcf2ttf](https://github.com/Deadalusmask/pcf2ttf)

## 相关文档

[https://fontforge.org/docs/techref/pcf-format.html](https://fontforge.org/docs/techref/pcf-format.html)

[https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d#path_commands](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d#path_commands)

[https://developer.mozilla.org/zh-CN/docs/Web/SVG/Attribute/fill-rule](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Attribute/fill-rule)

[https://docs.microsoft.com/en-us/typography/opentype/spec/glyf](https://docs.microsoft.com/en-us/typography/opentype/spec/glyf)

[https://github.com/opentypejs](https://github.com/opentypejs)
