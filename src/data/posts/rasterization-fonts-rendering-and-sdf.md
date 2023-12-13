---
title: '光栅化、字体渲染和SDF'
date: 2021-12-21 16:22:00
---

## 光栅化

首先简单介绍位图和矢量图的区别：

位图是使用像素阵列来表示的图像。位图文件通过解码后，可以获得图片上每个像素点对应的颜色。
在 js 中，位图文件都可以被加载为一个 `ImageData` 对象，然后就可以对每个像素的颜色进行编辑。
`ImageData` 中的数据格式为 `Uint8ClampedArray`，长度为宽度\*高度\*4，即每个像素占用 4 个字节来分别保存 rgba 通道的数值。

例如我们可以创建一个宽高为`w*h`的 ImageData 对象, 并设置每个像素的红色和绿色值为像素的 x 坐标和 y 坐标的大小。

```js
const imageData = new ImageData(w, h)

for (let i = 0; i < h; i++) {
  for (let j = 0; j < w; j++) {
    const index = j * w + i
    const uv = [(i + 0.5) / w, (j + 0.5) / h]
    imageData.data[index * 4 + 0] = uv[0] * 255
    imageData.data[index * 4 + 1] = uv[1] * 255
    imageData.data[index * 4 + 2] = 0
    imageData.data[index * 4 + 3] = 255
  }
}
```

位图文件格式有 bmp、jpeg、png、webp 以及最近的 [qoi](https://github.com/phoboslab/qoi) 等。

矢量图是计算机图形学中用点、线或者多边形等基于数学方程的几何图元表示的图像。矢量图保存的是对于图案内容的抽象描述，而不是具体的每个像素的颜色信息。

例如下面的 svg 图案声明了一个由三个坐标分别为 `(0.1, 0.1)`、`(0.9, 0.3)`、`(0.4, 0.9)` 的点组成的三角形，并将其填充为 `rgba(144,166,179,1)` 这个颜色。

```jsx
<svg style="width: 256px; height: 256px" viewBox="0 0 1 1">
  <path d="M0.1 0.1L0.9 0.3L0.4 0.9z" fill="rgba(144,166,179,1)"></path>
</svg>
```

矢量图文件除了 svg 外,还有 [iconvg](https://github.com/google/iconvg) 及 [tinyVG](https://tinyvg.tech/) 等。

光栅化（Rasterization）就是将矢量图数据转换为位图数据的过程。

下图展示了将前面 svg 示例中描述的三角形光栅化到画布上的结果，
从左到右、从上到下分别是 16\*16 分辨率、32\*32 分辨率、64\*64 分辨率、128\*128 分辨率、256\*256 分辨率和抗锯齿处理后的 256\*256 分辨率。

![rasterization](/img/triangle-rasterization.png)

最后一张是直接使用 SVG 标签展示的，由浏览器内部进行光栅化和抗锯齿处理。

## 字体文件及渲染

字体文件格式主要有 TTF、OTF 和 WOFF/WOFF2

OTF 为 TTF 的扩展，而 WOFF 是一种包裹格式，主要提供了数据压缩。

字体文件中数据使用大端序存储（RIFF 为小端序）。

字体文件既支持位图字形，也支持矢量字形。

文件内部分为多个 table，每个 table 用一个 tag 标识类型，比如 `camp` table 用于保存字符编码到字形的映射，`glyf` table 用于保存具体的矢量字形信息。

微软的字体文件格式声明文档：[The OpenType Font File](https://docs.microsoft.com/en-us/typography/opentype/spec/otff)

字体文件编辑：[FontForge](https://fontforge.org/en-US/)

裁剪字体文件、单独编辑某个字形或者用于创建 iconfont(在 0xE000 ~ 0xF8FF 范围内)。

渲染字体的主要工作就是从字体文件中读取每个文字的字形并将其光栅化，具体实践可以参考 Evan Wallace 的这篇 [Easy Scalable Text Rendering on the GPU](https://medium.com/@evanwallace/easy-scalable-text-rendering-on-the-gpu-c3f4d782c5ac#.z5mtsrx99)

## SDF 和字体渲染

SDF(signed distance field, 有向距离场)， 场中每个坐标对应一个到物体表面的最近距离，如果坐标点在物体内部则距离为负。

Inigo Quilez 收集的[2D 距离函数](https://iquilezles.org/www/articles/distfunctions2d/distfunctions2d.htm)

Valve 在 2007 年的 siggraph 上提出了使用距离场渲染文字的方法：
[Improved Alpha-Tested Magnification for Vector Textures and Special Effects](https://steamcdn-a.akamaihd.net/apps/valve/2007/SIGGRAPH2007_AlphaTestedMagnification.pdf)

此方法预先从高分辨率的字体纹理中生成低分辨率的距离场纹理，然后使用距离场纹理通过 alpha-test 和 smoothstep 渲染字体。
这种方法在 3d 场景实时渲染中更高效，且轮廓和阴影等效果的实现都很方便。

利用多通道 sdf 还能实现字体的锐利的角的展示，相关工具: [msdfgen](https://github.com/Chlumsky/msdfgen)
