import { pxToClipSpace } from "../helpers/shaders/pxToClipSpace";
import {
  terrainShaderAttributes,
  terrainShaderUniforms,
} from "./terrain.attributes";

export const terrainVertexShader = `#version 300 es
 
uniform vec2 ${terrainShaderUniforms.u_resolution};

in vec2 ${terrainShaderAttributes.a_position};
 
void main() {
  ${pxToClipSpace(
    terrainShaderAttributes.a_position,
    terrainShaderUniforms.u_resolution
  )}
}`;
