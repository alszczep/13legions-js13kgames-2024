export const colorKeys = {
  sky: "sky",
  ground: "ground",
  red: "red",
  yellow: "yellow",
  blue: "blue",
} as const;

type ColorVectors = {
  [key in keyof typeof colorKeys]: [number, number, number];
};

export const colorVectors: ColorVectors = {
  [colorKeys.sky]: [0.5, 0.7, 0.9],
  [colorKeys.ground]: [0.2, 0.5, 0.2],
  [colorKeys.red]: [1, 0, 0],
  [colorKeys.yellow]: [1, 1, 0],
  [colorKeys.blue]: [0, 0, 1],
};
