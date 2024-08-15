import { pxToClipSpace } from "../helpers/shaders/pxToClipSpace";

export const terrainVertexShader = `#version 300 es
 
uniform vec2 u_resolution;

in vec2 a_position;
 
void main() {
  ${pxToClipSpace}
}`;
