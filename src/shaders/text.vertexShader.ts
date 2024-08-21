import { pxToClipSpace } from "../helpers/shaders/pxToClipSpace";
import { textShaderAttributes, textShaderUniforms } from "./text.attributes";

export const textVertexShader = `#version 300 es
 
uniform vec2 ${textShaderUniforms.u_resolution};

in vec2 ${textShaderAttributes.a_position};
in vec2 ${textShaderAttributes.a_texCoord};

out vec2 v_texCoord;
 
void main() {
  ${pxToClipSpace(
    textShaderAttributes.a_position,
    textShaderUniforms.u_resolution
  )}
  v_texCoord = a_texCoord;
}`;
