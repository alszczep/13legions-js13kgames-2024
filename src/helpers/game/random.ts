import { BaseColors, colorKeys } from "../../colors";

export function randomFromRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function randomBaseColor(): BaseColors {
  const r = Math.random();

  if (r < 1 / 3) {
    return colorKeys.r;
  } else if (r < 2 / 3) {
    return colorKeys.y;
  } else {
    return colorKeys.b;
  }
}

export function randomOneOfTwoWeighted(left: number, right: number) {
  const r = Math.random() * (left + right);
  return r < left ? "l" : "r";
}
