#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
uniform float uAnimationStart;

const int DATA_LENGTH = 128;
uniform Block {
  float data[DATA_LENGTH];
};

in vec2 fragCoord;
out vec4 fragColor;

// vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
// vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
// vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

// float snoise(vec2 v) {
//   const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
//                       0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
//                       -0.577350269189626,  // -1.0 + 2.0 * C.x
//                       0.024390243902439); // 1.0 / 41.0
//   vec2 i  = floor(v + dot(v, C.yy) );
//   vec2 x0 = v -   i + dot(i, C.xx);
//   vec2 i1;
//   i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
//   vec4 x12 = x0.xyxy + C.xxzz;
//   x12.xy -= i1;
//   i = mod289(i); // Avoid truncation effects in permutation
//   vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
//       + i.x + vec3(0.0, i1.x, 1.0 ));

//   vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
//   m = m*m ;
//   m = m*m ;
//   vec3 x = 2.0 * fract(p * C.www) - 1.0;
//   vec3 h = abs(x) - 0.5;
//   vec3 ox = floor(x + 0.5);
//   vec3 a0 = x - ox;
//   m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
//   vec3 g;
//   g.x  = a0.x  * x0.x  + h.x  * x0.y;
//   g.yz = a0.yz * x12.xz + h.yz * x12.yw;
//   return 130.0 * dot(m, g);
// }

float sdCircle(vec2 p, float r) {
  return length(p) - r;
}


void main() {
  vec2 uv = fragCoord / iResolution;
  vec2 p = (-iResolution + 2. * (fragCoord)) / iResolution.y; // -1 <> 1 by height  
  vec2 pm = (-iResolution + 2. * (vec2(iMouse.x, iResolution.y-iMouse.y))) / iResolution.y;

  float ct = iTime - uAnimationStart;
  float animating = step(0., 1. - ct/500.);
  float g = animating * sqrt(abs(sdCircle(p - pm, 0.5 - abs(0.5 - ct/500.))));
  float alpha = animating * (1.-g) * (1. - abs(fract(ct/500.) - 0.5) * 2.);

  // audio
  vec2 pos = vec2(uv.x, 100.);
  if (fragCoord.y < 32.) {
    pos.y = fragCoord.y/32. - 1.;
  }
  int idx = int(pos.x * float(DATA_LENGTH));
  float dx = (data[idx]+30.)/70.; // -30 <> -100 => -0 <> -1
  float note = step(0., pos.y - dx); 
  // shadow
  // float g = -0.3*note+0.3;
  // float shadow = 1. - mix(pow(abs(abs(uv.y - 0.5) - 1.), 0.2), pow(abs(abs(uv.x-0.5) - 1.), 0.2), 0.5);
  // float alpha = clamp(shadow + (1.-note), 0., 1.) ;
  // fragColor = vec4(vec3(g), alpha);
  g = min(note + 0.3, g + 0.3);
  alpha = max(clamp(1.-note, 0., 1.), alpha);
  fragColor = vec4(vec3(g), alpha);
}
