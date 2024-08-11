import { glCreateProgram } from "./helpers/glCreateProgram";
import { glCreateShader } from "./helpers/glCreateShader";
import { fragmentShaderSource } from "./shaders/fragmentShaderSource";
import { vertexShaderSource } from "./shaders/vertexShaderSource";

export function createProgram(gl: WebGL2RenderingContext) {
  const vertexShader = glCreateShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = glCreateShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );

  return glCreateProgram(gl, vertexShader, fragmentShader);
}
