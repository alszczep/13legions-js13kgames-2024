import {
  DimensionsAndCoordinates,
  Dimensions,
} from "../types/DimensionsAndCoordinates";

export function dimensionsToRectangleVertices(
  { x, y, w, h }: DimensionsAndCoordinates,
  { base, flipX }: { base?: Dimensions; flipX?: boolean } = {}
) {
  const baseWithDefault = base ?? { w: 1, h: 1 };
  const x1 = x / baseWithDefault.w;
  const x2 = (x + w) / baseWithDefault.w;
  const y1 = y / baseWithDefault.h;
  const y2 = (y + h) / baseWithDefault.h;

  if (flipX) {
    return [x2, y1, x1, y1, x2, y2, x2, y2, x1, y1, x1, y2];
  }

  return [x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2];
}
