import { SPRITE_SIZE_MULTIPLIER } from "../consts";
import { dimensionsToRectangleVertices } from "../helpers/rendering/dimensionsToRectangleVertices";
import { DimensionsAndCoordinates } from "../types/DimensionsAndCoordinates";
import spriteSheetDataJson from "./spriteSheetData.json";

type SpriteKeys = keyof typeof spriteSheetDataJson.f;
export type SpriteData = DimensionsAndCoordinates & {
  texCoords: number[];
};
type SpriteSheetData = {
  [key in SpriteKeys]: SpriteData;
};

const spriteSheetSize = {
  w: spriteSheetDataJson.w,
  h: spriteSheetDataJson.h,
};

export const spriteSheetData = Object.entries(spriteSheetDataJson.f).reduce(
  (acc, [name, frame]) => ({
    ...acc,
    [name]: {
      ...frame,
      w: frame.w * SPRITE_SIZE_MULTIPLIER,
      h: frame.h * SPRITE_SIZE_MULTIPLIER,
      texCoords: dimensionsToRectangleVertices(frame, {
        base: spriteSheetSize,
      }),
    },
  }),
  {}
) as SpriteSheetData;
