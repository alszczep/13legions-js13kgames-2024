export const vertexShaderSource = `#version 300 es
 
in vec2 a_position;
in vec2 a_texCoord;
in float a_colorToOffsetGrayId;

out vec2 v_texCoord;
out vec4 v_colorToOffsetGray;

uniform vec2 u_resolution;
 
void main() {
  vec2 scaledPosition = a_position;
  vec2 zeroToOne = scaledPosition / u_resolution;
  vec2 zeroToTwo = zeroToOne * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;
  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

  v_texCoord = a_texCoord;

  switch (int(a_colorToOffsetGrayId)) {
    case 0:
        v_colorToOffsetGray = vec4(0.0, 0.0, 0.0, 0.0);
        break;
    case 1:
        v_colorToOffsetGray = vec4(1.0, 0.0, 0.0, 1.0);
        break;
    case 2:
        v_colorToOffsetGray = vec4(0.0, 1.0, 0.0, 1.0);
        break;
    case 3:
        v_colorToOffsetGray = vec4(0.0, 0.0, 1.0, 1.0);
        break;
    default:
        v_colorToOffsetGray = vec4(0.0, 0.0, 0.0, 0.0);
        break;
  }
}`;
