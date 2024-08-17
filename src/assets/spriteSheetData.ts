import { dimensionsToRectangleVertices } from "../helpers/rendering/dimensionsToRectangleVertices";
import { DimensionsAndCoordinates } from "../types/DimensionsAndCoordinates";
import spriteSheetDataJson from "./spriteSheetData.json";

type SpriteKeys = keyof typeof spriteSheetDataJson.frames;
export type SpriteData = DimensionsAndCoordinates & {
  texCoords: number[];
};
type SpriteSheetData = {
  [key in SpriteKeys]: SpriteData;
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
      texCoords: dimensionsToRectangleVertices(sprite.frame, {
        base: spriteSheetSize,
      }),
    },
  }),
  {}
) as SpriteSheetData;
