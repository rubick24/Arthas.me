---
title: '我理解的计算机图形学'
date: 2019-12-19 18:43
---

## backgrounds

首先需要明确的是，在现实世界中，被人眼/相机观测的到内容都是 2D 的，3D 是双眼效应（Binocular vision）和大脑脑补的结果，包括全息、VR 设备和 3D 电影。
显示设备大多数也是输出 2D 图像（一些烟雾屏幕除外）。

然后是二维图像，一张二维图像由许多像素点组成，每个像素点有自己的颜色，颜色可以由你定义的任何值表示，单通道的灰度图，三个数组成的 rgb 值，还可以附加一个透明度信息，可以使用别的颜色表示系统等。一张矩形的图像由宽\*高个像素组成，那么我们的目的就是分别计算这些像素的颜色并将其显示在设备上。

所以我们要做的是实现一个 `pixelData => color` 的函数 （着色函数），然后输入渲染每个像素的需要的数据，就得到了每个像素的颜色。
提供给着色函数的数据分为两类，一类是所有像素共享的，在一次渲染中一致的信息，常用的有当前时间，屏幕尺寸，图片纹理等。另一类是每个像素都不同的信息，主要是像素位置。

## 2d

下面是一个使用`div`作为显示终端渲染 2D 图形的简单实现，根据像素的位置信息 `p(x, y)` 以及给定的圆心和半径, 我们可以得到像素位置距圆心的距离，及此像素是否在圆内，然后就可以决定此像素是什么颜色。我们还可以根据当前时间`t`来变换半径的大小和颜色，效果如下。



```js
const color = (r, g, b, a) => {
  return `rgba(${r * 255} , ${g * 255}, ${b * 255}, ${a})`
}

const container = document.getElementById('app')
const width = 40
const height = 40
container.style.width = `${width * 4}px`
container.style.height = `${height * 4}px`
const pixels = new Array(width * height).fill(null).map(() => {
  const pixel = document.createElement('div')
  container.appendChild(pixel)
  return pixel
})

const render = t => {
  // circle
  const origin = [0.5, 0.5]
  const ridus = Math.sin(t / 1000) / 4 + 0.25

  pixels.forEach((v, i) => {
    const p = [(i % height) / width, Math.floor(i / width) / height]
    let res = [0, 0, 0, 0]

    // draw circle
    const l = Math.sqrt((p[0] - origin[0]) ** 2 + (p[1] - origin[1]) ** 2)
    if (l < ridus) {
      // inside circle
      const r = Math.sin(t / 1000) / 2 + 0.5
      const g = Math.sin(t / 1000 + 1) / 2 + 0.5
      const b = Math.sin(t / 1000 + 2) / 2 + 0.5
      res = [r, g, b, 1]
    }

    v.style.backgroundColor = color(...res)
  })
  requestAnimationFrame(render)
}
requestAnimationFrame(render)
```

[Try it on CodeSandbox](https://codesandbox.io/s/2d-rendering-with-div-d1bc0)

## 3d

接下来是渲染 3D，我们将 3D 空间中的坐标投影在 2D 平面上。如果是正交投影, 当前像素的颜色就是在屏幕空间当前像素位置在屏幕法线方向上光线的颜色，如果是透视投影，当前像素的颜色就是视点位置在 _视点到像素位置_ 的方向上的光线颜色。

简单实现如下，球在 z 轴的位置根据时间移动，因为没有计算光线，直接使用了法线方向作为颜色输出，`rgb` 对应法线的 `xyz` 坐标

```js
const sphIntersect = (ro, rd, center, radius) => {
  const oc = vec3.sub([], ro, center)
  const b = vec3.dot(oc, rd)
  const c = vec3.dot(oc, oc) - radius ** 2
  let h = b ** 2 - c

  if (h < 0.0) {
    return -1 // no intersection
  } else {
    h = Math.sqrt(h)
    return -b - h
  }
}

const render = t => {
  pixels.forEach((v, i) => {
    let res = [0, 0, 0, 0]
    const p = [(i % height) / width, Math.floor(i / width) / height] // 0 ~ 1
    p.forEach((_, i) => (p[i] = p[i] * 2 - 1)) // -1 ~ 1

    // ortho
    // const ro = [p[0], p[1], 10]
    // const rd = [0, 0, -1]

    // perspective
    const ro = [0, 0, 10]
    let rd = vec3.create()
    vec3.sub(rd, [p[0], p[1], 0], ro)
    vec3.normalize(rd, rd)

    const center = [0, 0, (Math.sin(t / 1000) / 2 + 0.5) * 5]
    const radius = 0.3
    const d = sphIntersect(ro, rd, center, radius)
    if (d > 0) {
      // normal
      const nor = vec3.create()
      // nor = normalize(ro + rd * d - center)
      vec3.add(nor, ro, vec3.scale(nor, rd, d))
      vec3.normalize(nor, vec3.sub(nor, nor, center))
      res = [...nor, 1]
    }

    v.style.backgroundColor = color(...res)
  })
  requestAnimationFrame(render)
}
requestAnimationFrame(render)
```

[Try it on CodeSandbox](https://codesandbox.io/s/3d-rendering-with-div-m9knk)


WebGL

## References

[The Book of Shaders](https://thebookofshaders.com/)

[sphere functions](http://www.iquilezles.org/www/articles/spherefunctions/spherefunctions.htm)
