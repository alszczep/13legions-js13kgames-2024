import { SPRITE_SIZE_MULTIPLIER } from "../../consts";
import { DimensionsAndCoordinates } from "../../types/DimensionsAndCoordinates";
import { combineVertexAttributeValues } from "./combinePositionAndTexCords";
import { dimensionsToRectangleVertices } from "./dimensionsToRectangleVertices";

export function drawCharacter(
  gl: WebGL2RenderingContext,
  grayOffsetColorUniformLocation: WebGLUniformLocation,
  characterBuffer: WebGLBuffer,
  {
    x,
    y,
    w,
    h,
    texCoords,
    grayOffsetColor,
    flipX,
  }: {
    texCoords: number[];
    grayOffsetColor: [number, number, number];
    flipX?: boolean;
  } & DimensionsAndCoordinates
) {
  gl.uniform3fv(
    grayOffsetColorUniformLocation,
    new Float32Array(grayOffsetColor)
  );

  const playerCharacterPosition = dimensionsToRectangleVertices(
    {
      x,
      y,
      w: w * SPRITE_SIZE_MULTIPLIER,
      h: h * SPRITE_SIZE_MULTIPLIER,
    },
    { flipX }
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, characterBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(
      combineVertexAttributeValues({
        elementsPerVertex: [2, 2],
        values: [playerCharacterPosition, texCoords],
      })
    ),
    gl.DYNAMIC_DRAW
  );

  gl.drawArrays(gl.TRIANGLES, 0, 1 * 6);
}
