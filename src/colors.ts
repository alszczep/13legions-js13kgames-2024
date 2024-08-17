export const colorKeys = {
  red: "red",
  yellow: "yellow",
  blue: "blue",

  sky: "sky",
  ground: "ground",
} as const;

export type BaseColors =
  | typeof colorKeys.red
  | typeof colorKeys.yellow
  | typeof colorKeys.blue;
export type Colors = (typeof colorKeys)[keyof typeof colorKeys];

type ColorVectors = {
  [key in keyof typeof colorKeys]: [number, number, number];
};

export const colorVectors: ColorVectors = {
  [colorKeys.red]: [1, 0, 0],
  [colorKeys.yellow]: [1, 1, 0],
  [colorKeys.blue]: [0, 0, 1],

  [colorKeys.sky]: [0.5, 0.7, 0.9],
  [colorKeys.ground]: [0.2, 0.5, 0.2],
};
