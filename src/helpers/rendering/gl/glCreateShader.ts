export function glCreateShader(
  gl: WebGL2RenderingContext,
  type: GLenum,
  source: string
) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  // success
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    return shader;
  }

  // TODO: comment before build
  // console.log(gl.getShaderInfoLog(shader));

  gl.deleteShader(shader);
  throw new Error("Shader compile error: " + type);
}
