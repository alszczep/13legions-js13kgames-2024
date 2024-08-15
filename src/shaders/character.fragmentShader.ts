export const characterFragmentShader = `#version 300 es
precision highp float;
 
uniform sampler2D u_image;
uniform vec3 u_color;

in vec2 v_texCoord;
in vec4 v_colorToOffsetGray;

out vec4 outColor;
 
void main() {
   vec4 colorFromTexture = texture(u_image, v_texCoord);

   if (colorFromTexture.r == colorFromTexture.g && colorFromTexture.g == colorFromTexture.b) {
      // TODO: come up with something better
      outColor = colorFromTexture * vec4(u_color, 1.0f);
   } else {
      outColor = colorFromTexture;
   }
}`;
