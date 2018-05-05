---
title: Graphic Basics 3 着色器
date: 2018-04-30 20:14:30
tags:
---

[[toc]]

着色器：[https://learnopengl.com/Getting-started/Shaders](https://learnopengl.com/Getting-started/Shaders)

## 加载Shader文件

使用webpack官方的raw-loader来加载

``` js
{
  test: /\.(glsl|vs|fs|txt)$/,
  use: 'raw-loader'
}
```
``` js
import vShader from './shaders/uv.vs'
import fShader from './shaders/texture.fs'
```

找到了[glslify](http://stack.gl/packages/#stackgl/glslify), 但因为它的维护不活跃了，所以没有使用。

## Shader 1 Static Color
vertex Shader
``` glsl
void main() {
    gl_Position = projectionMatrix *
                viewMatrix *
                modelMatrix *
                vec4(position,1.0);
}
```
fragment Shader
``` glsl
void main() {
    gl_FragColor = vec4(0.0, 0.5, 1, 1);
}
```

## Shader 2 Normal
vertex Shader
``` glsl
varying vec3 transformedNormal;

void main() {
  transformedNormal = normalMatrix * normal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}
```
fragment Shader
``` glsl
varying vec3 transformedNormal;

void main(void)
{
  gl_FragColor = vec4(transformedNormal, 1.0);
}
```

## Shader 3 Texture
vertex Shader
``` glsl
varying vec2 vUv;

void main() {
    vUv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}
```
fragment Shader
``` glsl
varying vec2 vUv;
uniform sampler2D theTexture;

void main() {
    gl_FragColor = texture2D(theTexture, vUv);
}
```


## Shader 4 Texture with static directional light
vertex Shader
``` glsl
varying vec3 vNormal;
varying vec2 vUv;

void main() {
    vNormal = normal;
    vUv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}
```
fragment Shader
``` glsl
varying vec3 vNormal;
varying vec2 vUv;
uniform sampler2D theTexture;

void main() {
    vec4 lightColor = vec4(1,1,1,1);
    vec3 lightDirection = normalize(vec3(1.0, 0.0, 1.0));
    float cosTheta = clamp(dot(vNormal, lightDirection), 0.0, 1.0);

    vec4 MaterialDiffuseColor = texture2D(theTexture, vUv);
    vec4 MaterialAmbientColor = vec4(0.1, 0.1, 0.1, 1.0) * MaterialDiffuseColor;

    gl_FragColor = MaterialAmbientColor +
                  MaterialDiffuseColor * lightColor * cosTheta;
}
```

## Shader 5 Texture with point lights in scene

js
``` js
let uniforms = THREE.UniformsUtils.merge([
  THREE.UniformsLib.lights
])
uniforms.uTexture = { type: 't', value: texture }

let material = new THREE.ShaderMaterial({
  uniforms: uniforms,
  vertexShader: vShader,
  fragmentShader: fShader,
  lights: true
});
```

vertex Shader
``` glsl
#include <common>
#include <bsdfs>
#include <lights_pars_begin>

varying vec2 vUv;
varying vec3 vLightFront;

void main() {

  vUv = uv;

  vLightFront = vec3( 0.0 );
  vec3 diffuse = vec3( 1.0 );

  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  vec3 transformedNormal = normalMatrix * normal;
  GeometricContext geometry;
  geometry.position = mvPosition.xyz;
  geometry.normal = normalize( transformedNormal );
  geometry.viewDir = normalize( -mvPosition.xyz );

  IncidentLight directLight;
  float dotNL;
  vec3 directLightColor_Diffuse;

  #if NUM_POINT_LIGHTS > 0
      #pragma unroll_loop
      for ( int i = 0; i < NUM_POINT_LIGHTS; i +) {
          getPointDirectLightIrradiance( pointLights[ i ], geometry, directLight );
          dotNL = dot( geometry.normal, directLight.direction );
          directLightColor_Diffuse = PI * directLight.color;
          vLightFront += saturate( dotNL ) * directLightColor_Diffuse;
      }
  #endif

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}
```
fragment Shader
``` glsl
#include <common>
#include <bsdfs>
#include <lights_pars_begin>
#include <shadowmask_pars_fragment>

varying vec2 vUv;
uniform sampler2D uTexture;
varying vec3 vLightFront;

void main() {
    ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );

    reflectedLight.indirectDiffuse = getAmbientLightIrradiance( ambientLightColor );
    reflectedLight.directDiffuse = vLightFront;

    reflectedLight.indirectDiffuse *= BRDF_Diffuse_Lambert( texture2D(uTexture, vUv).rgb );
    reflectedLight.directDiffuse *= BRDF_Diffuse_Lambert( texture2D(uTexture, vUv).rgb ) * getShadowMask();

    vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
    gl_FragColor = vec4(outgoingLight, 1.0);
}
```
