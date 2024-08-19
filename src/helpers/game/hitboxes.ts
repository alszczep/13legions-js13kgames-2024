import { DimensionsAndCoordinates } from "../../types/DimensionsAndCoordinates";

export function hitboxesToPoints(
  h1: DimensionsAndCoordinates,
  h2: DimensionsAndCoordinates
) {
  return {
    h1TopLeft: { x: h1.x, y: h1.y },
    h1BottomRight: { x: h1.x + h1.w, y: h1.y + h1.h },
    h2TopLeft: { x: h2.x, y: h2.y },
    h2BottomRight: { x: h2.x + h2.w, y: h2.y + h2.h },
  };
}

export function isFirstHitboxToTheLeft(
  h1: DimensionsAndCoordinates,
  h2: DimensionsAndCoordinates
) {
  const { h1BottomRight, h2TopLeft } = hitboxesToPoints(h1, h2);
  return h1BottomRight.x < h2TopLeft.x;
}

export function isFirstHitboxToTheRight(
  h1: DimensionsAndCoordinates,
  h2: DimensionsAndCoordinates
) {
  const { h1TopLeft, h2BottomRight } = hitboxesToPoints(h1, h2);
  return h1TopLeft.x > h2BottomRight.x;
}

export function doHitboxesOverlap(
  h1: DimensionsAndCoordinates,
  h2: DimensionsAndCoordinates
) {
  const { h1TopLeft, h1BottomRight, h2TopLeft, h2BottomRight } =
    hitboxesToPoints(h1, h2);

  if (
    h1BottomRight.x < h2TopLeft.x ||
    h2BottomRight.x < h1TopLeft.x ||
    h1BottomRight.y < h2TopLeft.y ||
    h2BottomRight.y < h1TopLeft.y
  )
    return false;

  return true;
}
