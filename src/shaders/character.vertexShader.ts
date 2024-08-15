import { pxToClipSpace } from "../helpers/shaders/pxToClipSpace";

export const characterVertexShader = `#version 300 es
 
uniform vec2 u_resolution;

in vec2 a_position;
in vec2 a_texCoord;

out vec2 v_texCoord;
 
void main() {
  ${pxToClipSpace}
  v_texCoord = a_texCoord;
}`;
