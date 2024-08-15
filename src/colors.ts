export const colorKeys = {
  red: "red",
  yellow: "yellow",
  blue: "blue",
} as const;

type ColorVectors = {
  [key in keyof typeof colorKeys]: [number, number, number];
};

export const colorVectors: ColorVectors = {
  [colorKeys.red]: [1, 0, 0],
  [colorKeys.yellow]: [1, 1, 0],
  [colorKeys.blue]: [0, 0, 1],
};
