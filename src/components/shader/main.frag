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

float sdCircle(vec2 p, float r) {
  return length(p) - r;
}



void main() {
  vec2 uv = fragCoord / iResolution;
  vec2 p = (-iResolution + 2. * (fragCoord)) / iResolution.y; // -1 <> 1 by height  
  vec2 pm = (-iResolution + 2. * (vec2(iMouse.x, iResolution.y-iMouse.y))) / iResolution.y;

  float ct = iTime - uAnimationStart;
  float ctp = ct/500.; // cp -> 0-1;
  float animating = step(0., 1. - ctp); // uAnimationStart 后500ms为1.
  float radius = 1.-pow(abs(ctp*2.-1.), 2.5);
  float g = smoothstep(0., 0.003, sdCircle(p - pm, radius*0.15));
  float alpha = animating * (1.-g);
  // float g = animating * sqrt(abs(sdCircle(p - pm, 0.5 - abs(0.5 - ct/500.))));
  // float alpha = animating * (1.-g) * (1. - abs(fract(ct/500.) - 0.5) * 2.);

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
