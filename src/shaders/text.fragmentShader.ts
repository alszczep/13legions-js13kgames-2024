import { textShaderUniforms } from "./text.attributes";

export const textFragmentShader = `#version 300 es
precision highp float;
 
uniform sampler2D ${textShaderUniforms.u_image};

in vec2 v_texCoord;
in vec4 v_colorToOffsetGray;

out vec4 outColor;
 
void main() {
   vec4 texColor = texture(${textShaderUniforms.u_image}, v_texCoord);
   outColor = texColor;
}`;
