var newTextureId = 0;

export function glCreateTexture(
  gl: WebGL2RenderingContext,
  image: HTMLImageElement | HTMLCanvasElement
) {
  const id = newTextureId;
  newTextureId++;

  const texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + id);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  return {
    texture,
    image,
    id,
  };
}
