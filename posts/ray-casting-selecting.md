---
title: 在WebGL中使用射线选择模型
date: 2018-08-21 18:52:03
tags:
---

[[toc]]

[DEMO](https://arthas.me/demo/ray-casting/index.html)

## 思路

首先要用到摄像机的位置、方向和鼠标在屏幕上的位置来得到射线的起点和方向，然后用得到的射线和模型的每个三角形测试来判断模型是否被选中。

## 构建射线

先实现简单的射线类：
```js
function Ray(position, direction) {
  this.position = position
  this.direction = direction
  return this
}
```

通过`camera.position`和`camera.front`可以直接得到一个以摄像机为原地，朝向摄像机正前方的射线。
然后，根据摄像机的fov和鼠标的位置坐标可以计算出鼠标所指方向偏离中心的x轴和y轴角度。
```js
argl.canvas.addEventListener('mousemove', e => {
  let angleY = -((e.offsetY * camera.zoom / argl.options.height) - (camera.zoom / 2))
  let zoomX = (camera.zoom / argl.options.height) * argl.options.width
  let angleX = (e.offsetX * zoomX / argl.options.width) - (zoomX / 2)
}
```

接下来，再将朝向摄像机正前方的向量在`camera.front`和`camera.right`两个向量所在的平面中旋转`angleX`度，再在旋转后的向量和`camera.up`两个向量所在的平面中旋转`angleY`度，就得到了鼠标所指向的方向。
```js
let normalFR = glm.vec3.create()
glm.vec3.cross(normalFR, camera.front, camera.right)
glm.vec3.normalize(normalFR, normalFR)

let direction = rotateVec(camera.front, normalFR, glm.glMatrix.toRadian(angleX))

let normalFU = glm.vec3.create()
glm.vec3.cross(normalFU, direction, camera.up)
glm.vec3.normalize(normalFU, normalFU)

direction = rotateVec(direction, normalFU, glm.glMatrix.toRadian(angleY))

//平面内向量的旋转，normal为平面的法线，angle为旋转角度
function rotateVec(vec, normal, angle) {
  let direction = glm.vec3.create()
  let t1 = glm.vec3.create()
  let t2 = glm.vec3.create()

  glm.vec3.normalize(normal, normal)

  glm.vec3.scale(t1, vec, Math.cos(angle))
  glm.vec3.cross(t2, normal, vec)
  glm.vec3.scale(t2, t2, Math.sin(angle))
  glm.vec3.add(direction, t1, t2)

  return direction
}
```

然后就可以构建所需射线了：
```js
let ray = new Ray(camera.position, direction)
```

## 射线三角形相交检测算法
使用的算法为[Möller–Trumbore intersection algorithm](https://en.wikipedia.org/wiki/M%C3%B6ller%E2%80%93Trumbore_intersection_algorithm)

js实现如下, 我将其作为Ray类的一个方法：
```js
Ray.prototype.intersectsTriangle = function (triangle) {
  const EPSILON = 0.0000001
  let edge1 = glm.vec3.create()
  let edge2 = glm.vec3.create()
  let h = glm.vec3.create()
  let s = glm.vec3.create()
  let q = glm.vec3.create()
  let a, f, u, v, t
  let temp = glm.vec3.create()

  glm.vec3.sub(edge1, triangle[1], triangle[0])
  glm.vec3.sub(edge2, triangle[2], triangle[0])
  glm.vec3.cross(h, this.direction, edge2)
  a = glm.vec3.dot(edge1, h)
  if (a > -EPSILON && a < EPSILON)
    return false
  f = 1/a
  glm.vec3.sub(s, this.position, triangle[0])
  u = f * glm.vec3.dot(s, h)
  if (u < 0.0 || u > 1.0)
    return false
  glm.vec3.cross(q, s, edge1)
  v = f * glm.vec3.dot(this.direction, q)
  if (v < 0.0 || u + v > 1.0)
      return false
  // At this stage we can compute t to find out where the intersection point is on the line.
  t = f * glm.vec3.dot(edge2, q)
  if (t > EPSILON) // ray intersection
  {
      let IntersectionPoint = glm.vec3.create()
      glm.vec3.scale(temp, this.direction, t)
      glm.vec3.add(IntersectionPoint, this.position, this.direction )
      return true
  }
  else // This means that there is a line intersection but not a ray intersection.
      return false
}
```
## 检测射线与模型是否相交

通过循环，使用`mesh.indices`和`mesh.vertices`中的数据来构建每一个三角形，再将其坐标变换到世界空间，然后检测他们是否与射线相交
```js
let flag = false
let len = suzanneMesh.indices.length

for (let i = 0; i < len; i += 3) {
  let index = [suzanneMesh.indices[i], suzanneMesh.indices[i + 1], suzanneMesh.indices[i + 2]]
  let triangle = [glm.vec3.create(), glm.vec3.create(), glm.vec3.create()]
  glm.vec3.transformMat4(triangle[0], [suzanneMesh.vertices[index[0] * 3], suzanneMesh.vertices[index[0] * 3 + 1], suzanneMesh.vertices[index[0] * 3 + 2]], model)
  glm.vec3.transformMat4(triangle[1], [suzanneMesh.vertices[index[1] * 3], suzanneMesh.vertices[index[1] * 3 + 1], suzanneMesh.vertices[index[1] * 3 + 2]], model)
  glm.vec3.transformMat4(triangle[2], [suzanneMesh.vertices[index[2] * 3], suzanneMesh.vertices[index[2] * 3 + 1], suzanneMesh.vertices[index[2] * 3 + 2]], model)

  if (ray.intersectsTriangle(triangle)) {
    flag = true
  }
}
```

然后即可利用布尔值`flag`来添加是否选中模型的效果了，demo中选中时模型变成红色。

## 完整代码

[Deadalusmask/ArGL/examples/click_test](https://github.com/Deadalusmask/ArGL/tree/master/examples/click_test)