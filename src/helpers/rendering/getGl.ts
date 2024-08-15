export function getGl() {
  const canvas = document.querySelector<HTMLCanvasElement>("#c")!;
  canvas.width = 1200;
  canvas.height = 600;

  const gl = canvas.getContext("webgl2")!;

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // handle transparency
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  return gl;
}
