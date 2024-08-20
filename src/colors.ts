export const colorKeys = {
  r: "r",
  y: "y",
  b: "b",

  sky: "sky",
  ground: "ground",
} as const;

export type BaseColors =
  | typeof colorKeys.r
  | typeof colorKeys.y
  | typeof colorKeys.b;
export type Colors = (typeof colorKeys)[keyof typeof colorKeys];

type ColorVectors = {
  [key in keyof typeof colorKeys]: [number, number, number];
};

export const colorVectors: ColorVectors = {
  [colorKeys.r]: [1, 0, 0],
  [colorKeys.y]: [1, 1, 0],
  [colorKeys.b]: [0, 0, 1],

  [colorKeys.sky]: [0.5, 0.7, 0.9],
  [colorKeys.ground]: [0.2, 0.5, 0.2],
};
