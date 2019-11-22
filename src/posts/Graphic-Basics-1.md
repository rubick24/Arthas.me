---
title: Graphic Basics 1 3D模型文件
date: 2018-04-26 20:01:58
tags:
---

## 3D 模型文件

### obj 格式

在 Blender 中以默认参数创建一个立方体，并直接将其导出为 OBJ 文件，其内容如下：

_cube.obj_

```
# Blender v2.79 (sub 0) OBJ File: ''
# www.blender.org
mtllib Cube.mtl
o Cube
v -1.000000 -1.000000 1.000000
v -1.000000 1.000000 1.000000
v -1.000000 -1.000000 -1.000000
v -1.000000 1.000000 -1.000000
v 1.000000 -1.000000 1.000000
v 1.000000 1.000000 1.000000
v 1.000000 -1.000000 -1.000000
v 1.000000 1.000000 -1.000000
vn -1.0000 0.0000 0.0000
vn 0.0000 0.0000 -1.0000
vn 1.0000 0.0000 0.0000
vn 0.0000 0.0000 1.0000
vn 0.0000 -1.0000 0.0000
vn 0.0000 1.0000 0.0000
usemtl None
s off
f 1//1 2//1 4//1 3//1
f 3//2 4//2 8//2 7//2
f 7//3 8//3 6//3 5//3
f 5//4 6//4 2//4 1//4
f 3//5 7//5 5//5 1//5
f 8//6 4//6 2//6 6//6
```

其中 `v` 开头的行为几何体顶点(Geometric vertices)数据，即这个立方体有 8 个顶点，其坐标的 x,y,z 值分别为每行对应的三个浮点数。

以 `vn` 开头的行为定点法线(Vertex normals)数据，三个浮点数表示其法线在 x,y,z 三个方向上的向量。

`usemtl` 指定了在这一行之后的元素使用的材质名称，这个名称定义在 mtl 文件中。

`s off` 表示关闭平滑着色(Smooth shading disabled)

`f` 表示一个面元素(Face Element),其后的数据格式为 `v/vt/vn` ，即顶点索引、顶点材质索引和顶点法线索引，vt 和 vn 都可以省略。以第一行面元素为例，其由 4 个顶点按顺序组成，其索引分别为 1，2，4，3，法线索引都为 1，即法线方向都为(-1,0,0)

在上面的立方体文件中，因为 Blender 中创建立方体默认没有 uv 贴图坐标，所以没有以 `vt` 开始的行，在面元素描述时用 `v//vn` 省略。

维基百科：
[Wavefront .obj file](https://en.wikipedia.org/wiki/Wavefront_.obj_file)

### Three.js' ASCII JSON format.

使用 Three.js 提供的 Blender 插件[io_three](https://github.com/mrdoob/three.js/tree/dev/utils/exporters/blender)可以从 Blender 中导出用于 Three.js 的 json 格式文件。

导出一个默认的立方体如下：

_Cube.json_

```json
{
    "vertices":[-1,-1,1,-1,1,1,-1,-1,-1,-1,1,-1,1,-1,1,1,1,1,1,-1,-1,1,1,-1],
    "uvs":[],
    "metadata":{
        "generator":"io_three",
        "uvs":0,
        "type":"Geometry",
        "vertices":8,
        "version":3,
        "normals":6,
        "faces":6
    },
    "normals":[-1,0,0,0,-2.98023e-08,-1,1,0,0,0,2.98023e-08,1,0,-1,2.98023e-08,0,1,-2.98023e-08],
    "faces":[33,0,1,3,2,0,0,0,0,33,2,3,7,6,1,1,1,1,33,6,7,5,4,2,2,2,2,33,1,0,4,5,3,3,3,3,33,4,0,2,6,4,4,4,4,33,7,3,1,5,5,5,5,5]
}
```

可以看出，其中`metadata`用来保存一些元信息，`vertices`,`uvs`,`normals`和`faces`分别用一个一维数组来储存所有的数据。

`faces`中的`33`表示接下来是一个 4 个顶点的面，其后的 5 个元素中，前 4 个表示顶点的索引，第 5 个表示法线的索引。