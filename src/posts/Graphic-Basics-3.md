---
title: Graphic Basics 3 着色器
date: 2018-04-30 20:14:30
tags:
---

着色器：[https://learnopengl.com/Getting-started/Shaders](https://learnopengl.com/Getting-started/Shaders)

## 加载 Shader 文件

使用 webpack 官方的 raw-loader 来加载

```js
{
  test: /\.(glsl|vs|fs|txt)$/,
  use: 'raw-loader'
}
```

```js
import vShader from "./shaders/uv.vs"
import fShader from "./shaders/texture.fs"
```

找到了[glslify](http://stack.gl/packages/#stackgl/glslify), 但因为它的维护不活跃了，所以没有使用。
