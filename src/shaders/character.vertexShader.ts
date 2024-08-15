import { pxToClipSpace } from "../helpers/shaders/pxToClipSpace";
import {
  characterShaderAttributes,
  characterShaderUniforms,
} from "./character.attributes";

export const characterVertexShader = `#version 300 es
 
uniform vec2 ${characterShaderUniforms.u_resolution};

in vec2 ${characterShaderAttributes.a_position};
in vec2 ${characterShaderAttributes.a_texCoord};

out vec2 v_texCoord;
 
void main() {
  ${pxToClipSpace(
    characterShaderAttributes.a_position,
    characterShaderUniforms.u_resolution
  )}
  v_texCoord = a_texCoord;
}`;
