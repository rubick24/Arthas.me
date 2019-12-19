#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
uniform int uDarkMode;
uniform float uAnimationStart;

const int DATA_LENGTH = 128;
uniform Block {
  float data[DATA_LENGTH];
};

in vec2 fragCoord;
out vec4 fragColor;

const float PI = 3.1415926;

float sdCircle(vec2 p, float r) {
  return length(p) - r;
}

vec2 rotate(vec2 p, float rad) {
  mat2 rotateMat = mat2(
    cos(rad), -sin(rad),
    sin(rad), cos(rad)
  );
  return rotateMat * p;
}

float arc(vec2 p, float x1, float x2, float len, float rad) {
  vec2 rotatedPos = rotate(p, rad);
  float r = length(rotatedPos)*2.0;
  float a = atan(rotatedPos.y,rotatedPos.x) + PI;
  float fan = min(1.-step(len,a), step(0., a));
  float frg = fan * min(smoothstep((1.-x2)-1e-2, (1.-x2), 1.-r), smoothstep(x1, x1+1e-2, r));
  return 1. - frg;
}

float sdPie( in vec2 p, in vec2 c, in float r ) {
  p.x = abs(p.x);
  float l = length(p) - r;
  float m = length(p-c*clamp(dot(p,c),0.0,r)); // c = sin/cos of the aperture
  return max(l,m*sign(c.y*p.x-c.x*p.y));
}

float audio(vec2 uv) {
  vec2 pos = vec2(uv.x, 100.);
  if (fragCoord.y < 32.) {
    pos.y = fragCoord.y/32. - 1.;
  }
  int idx = int(pos.x * float(DATA_LENGTH));
  float dx = (data[idx]+30.)/70.; // -30 <> -100 => -0 <> -1
  return step(0., pos.y - dx); 
}

void main() {
  vec2 uv = fragCoord / iResolution;
  vec2 p = (-iResolution + 2. * fragCoord) / iResolution.y; // -1 <> 1 by height  
  vec2 pm = (-iResolution + 2. * vec2(iMouse.x, iResolution.y-iMouse.y)) / iResolution.y;

  float ct = iTime - uAnimationStart;
  float ctp = ct/500.; // cp -> 0-1;
  float animating = step(0., 1. - ctp); // uAnimationStart 后500ms为1.
  vec2 center = p - pm;

  float radius = 1.-pow(abs(ctp*2.-1.), 2.5);
  float g = smoothstep(0., 0.003, sdCircle(center, radius*0.05));
  float arc1 = arc(center, 0.2, 0.23, PI*1.2, ctp * PI * 0.8);
  g = min(animating * arc1, g);
  float arc2 = arc(center, 0.15, 0.17, PI*0.6, -ctp * PI * 1.2);
  g = min(animating * arc2, g);

  float arcRad = (1. - abs(ctp - 0.5) * 2.) * 1./3. * PI;
  vec2 pieP =  vec2(sin(arcRad),cos(arcRad));
  float rotateRad = (ctp * PI + length(center) * 1.5);
  float arc3 = step(1e-4, sdPie(rotate(center, rotateRad), pieP, 4.));
  g = min(animating * arc3 + 0.2, g);
  float arc4 = step(1e-4, sdPie(rotate(center, rotateRad + PI * 2. / 3.), pieP, 4.));
  g = min(animating * arc4 + 0.2, g);
  float arc5 = step(1e-4, sdPie(rotate(center, rotateRad + PI * 4. / 3.), pieP, 4.));
  g = min(animating * arc5 + 0.2, g);
  
  float alpha = animating * (1.-g);

  float au = audio(uv);
  g = min(au, g);
  alpha = max(clamp(1.-au, 0., 1.), alpha);
  
  g = (g-0.5) * 0.7 + 0.5;
  // darkMode
  g = bool(uDarkMode) ? 1.-g : g;
  fragColor = vec4(vec3(pow(g, 1./2.2)), alpha);
}
