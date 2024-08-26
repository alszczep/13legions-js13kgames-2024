import { terrainShaderUniforms } from "./terrain.attributes";

export const terrainFragmentShader = `#version 300 es
precision highp float;
 
uniform vec3 ${terrainShaderUniforms.u_color};
uniform float ${terrainShaderUniforms.u_y};
uniform float ${terrainShaderUniforms.u_h};
uniform float ${terrainShaderUniforms.u_sky};
uniform vec2 ${terrainShaderUniforms.u_resolution};

out vec4 outColor;

bool higherThanPercentage(float p) {
   return gl_FragCoord.y > (${terrainShaderUniforms.u_y} - ${terrainShaderUniforms.u_h} * p);
}

void solid(float d) {
   outColor = vec4(outColor.rgb * d, 1.0f);
}

void stripes(float d, float b, float o) {
   if(int((gl_FragCoord.x + o) / 1.75f) % 2 == 0) {
      outColor = vec4(outColor.rgb * d, 1.0f);
   } else {
      outColor = vec4(outColor.rgb * b, 1.0f);
   }
}

void main() {
   outColor = vec4(${terrainShaderUniforms.u_color}, 1.0f);
   
   if(${terrainShaderUniforms.u_sky} == 1.0f) {
      vec2 zeroToOneCoords = gl_FragCoord.xy / ${terrainShaderUniforms.u_resolution};
      zeroToOneCoords = vec2(zeroToOneCoords.x, 1.0f - zeroToOneCoords.y);
      
      float brightness = sqrt(1.0f - distance(zeroToOneCoords, vec2(0.5f, 0.75f))) * 1.45f;
      outColor = vec4(outColor.rgb * brightness, 1.0f);
   } else {
      if(higherThanPercentage(0.1f)) {
         solid(0.5f);
      } else if(higherThanPercentage(0.2f)) {
         stripes(0.5f, 0.65f, 0.0f);
      } else if(higherThanPercentage(0.3f)) {
         solid(0.65f);
      } else if(higherThanPercentage(0.4f)) {
         stripes(0.65f, 0.80f, 1.75f);
      } else if(higherThanPercentage(0.5f)) {
         solid(0.80f);
      } else if(higherThanPercentage(0.6f)) {
         stripes(0.80f, 0.90f, 0.0f);
      } else if(higherThanPercentage(0.7f)) {
         solid(0.90f);
      } else if(higherThanPercentage(0.8f)) {
         stripes(0.90f, 0.95f, 1.75f);
      } else if(higherThanPercentage(0.9f)) {
         solid(0.95f);
      }
   }
}`;
