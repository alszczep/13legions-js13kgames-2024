import { terrainShaderUniforms } from "./terrain.attributes";

export const terrainFragmentShader = `#version 300 es
precision highp float;
 
uniform vec3 ${terrainShaderUniforms.u_color};

out vec4 outColor;
 
void main() {
   outColor = vec4(${terrainShaderUniforms.u_color}, 1.0f);
}`;
