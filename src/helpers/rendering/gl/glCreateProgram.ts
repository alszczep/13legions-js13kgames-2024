export function glCreateProgram(
  gl: WebGL2RenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
) {
  const program = gl.createProgram()!;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
    return program;
  }

  // TODO: comment before build
  console.log(gl.getProgramInfoLog(program));

  gl.deleteProgram(program);

  // TODO: comment before build
  throw new Error("Program create");
}
