import { characterShaderUniforms } from "./character.attributes";

export const characterFragmentShader = `#version 300 es
precision highp float;
 
uniform sampler2D ${characterShaderUniforms.u_image};
uniform vec3 ${characterShaderUniforms.u_color};

in vec2 v_texCoord;
in vec4 v_colorToOffsetGray;

out vec4 outColor;
 
void main() {
   vec4 texColor = texture(${characterShaderUniforms.u_image}, v_texCoord);

   if (texColor.r == texColor.g && texColor.g == texColor.b && texColor.a != 0.0f) {
      // TODO: come up with something better
      float color = texColor.r + (1.0f - texColor.r) * 0.6f;
      outColor = vec4(color * ${characterShaderUniforms.u_color}, 1.0f);
   } else {
      outColor = texColor;
   }
}`;
