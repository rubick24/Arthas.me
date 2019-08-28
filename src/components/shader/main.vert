#version 300 es
precision highp float;

layout (location = 0) in vec2 position;

uniform vec2 iResolution;

out vec2 fragCoord;

void main() {
  fragCoord = iResolution * (position + 1.) / 2.;
  gl_Position = vec4(position, 0, 1);
}
