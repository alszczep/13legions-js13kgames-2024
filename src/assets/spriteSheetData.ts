import { SPRITE_SIZE_MULTIPLIER } from "../consts";
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

const calcTexCoords = ({
  x,
  y,
  w,
  h,
}: (typeof spriteSheetDataJson.f)[SpriteKeys]) => {
  const x1 = x / spriteSheetSize.w;
  const x2 = (x + w) / spriteSheetSize.w;
  const y1 = y / spriteSheetSize.h;
  const y2 = (y + h) / spriteSheetSize.h;

  const ceilWithPrecision = (x: number) => Math.ceil(x * 100) / 100;
  const floorWithPrecision = (x: number) => Math.floor(x * 100) / 100;

  // aseprite can sometimes generate sprites in e.g. 3 columns, and it results in having texCoords with recurring decimals,
  // which sometimes manifests itself as thin stripes at the edge of a sprite
  // this workaround moves the edges of texCoords slightly towards the middle of the sprite
  // prettier-ignore
  return [
    ceilWithPrecision(x1), ceilWithPrecision(y1),
    floorWithPrecision(x2), ceilWithPrecision(y1),
    ceilWithPrecision(x1), floorWithPrecision(y2),
    ceilWithPrecision(x1), floorWithPrecision(y2),
    floorWithPrecision(x2), ceilWithPrecision(y1),
    floorWithPrecision(x2), floorWithPrecision(y2)
  ];
};

export const spriteSheetData = Object.entries(spriteSheetDataJson.f).reduce(
  (acc, [name, frame]) => ({
    ...acc,
    [name]: {
      ...frame,
      w: frame.w * SPRITE_SIZE_MULTIPLIER,
      h: frame.h * SPRITE_SIZE_MULTIPLIER,
      texCoords: calcTexCoords(frame),
    },
  }),
  {}
) as SpriteSheetData;
