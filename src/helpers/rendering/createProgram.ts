import { glCreateProgram } from "./gl/glCreateProgram";
import { glCreateShader } from "./gl/glCreateShader";

export function createProgram(
  gl: WebGL2RenderingContext,
  vertexShaderSource: string,
  fragmentShaderSource: string
) {
  const vertexShader = glCreateShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = glCreateShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );

  return glCreateProgram(gl, vertexShader, fragmentShader);
}
