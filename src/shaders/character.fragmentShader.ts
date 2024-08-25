import { characterShaderUniforms } from "./character.attributes";

export const characterFragmentShader = `#version 300 es
precision highp float;
 
uniform sampler2D ${characterShaderUniforms.u_image};
uniform vec3 ${characterShaderUniforms.u_color};

in vec2 v_texCoord;

out vec4 outColor;
 
void main() {
   vec4 texColor = texture(${characterShaderUniforms.u_image}, v_texCoord);

   bool isTexColorGray = texColor.r == texColor.g && texColor.g == texColor.b && texColor.a != 0.0f;
   // rock hack
   bool isOffsetColor0 = ${characterShaderUniforms.u_color}.r == 0.0f && ${characterShaderUniforms.u_color}.g == 0.0f && ${characterShaderUniforms.u_color}.b == 0.0f;
   if (isTexColorGray && !isOffsetColor0) {
      float color = texColor.r + (1.0f - texColor.r) * 0.45f;
      outColor = vec4(color * ${characterShaderUniforms.u_color}, 1.0f);
   } else {
      outColor = texColor;
   }
}`;
