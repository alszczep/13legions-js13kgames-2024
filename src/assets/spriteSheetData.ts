import { dimensionsToRectangleVertices } from "../helpers/dimensionsToRectangleVertices";
import { DimensionsAndCoordinates } from "../types/DimensionsAndCoordinates";
import spriteSheetDataJson from "./spriteSheetData.json";

type SpriteKeys = keyof typeof spriteSheetDataJson.frames;
type SpriteSheetData = {
  [key in SpriteKeys]: DimensionsAndCoordinates & {
    texCoords: Float32Array;
    texCoordsXFlipped: Float32Array;
  };
};

const spriteSheetSize = spriteSheetDataJson.meta.size;

// TODO: do not import whole json
export const spriteSheetData = Object.entries(
  spriteSheetDataJson.frames
).reduce(
  (acc, [name, sprite]) => ({
    ...acc,
    [name]: {
      ...sprite.frame,
      texCoords: new Float32Array(
        dimensionsToRectangleVertices(sprite.frame, { base: spriteSheetSize })
      ),
      texCoordsXFlipped: new Float32Array(
        dimensionsToRectangleVertices(sprite.frame, {
          base: spriteSheetSize,
          flipX: true,
        })
      ),
    },
  }),
  {}
) as SpriteSheetData;
