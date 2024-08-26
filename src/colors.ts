export const colorKeys = {
  r: "r",
  y: "y",
  b: "b",

  s1: "s1",
  g1: "g1",
  s2: "s2",
  g2: "g2",
  s3: "s3",
  g3: "g3",
  s4: "s4",
  g4: "g4",
  s5: "s5",
  g5: "g5",
  s6: "s6",
  g6: "g6",
  s7: "s7",
  g7: "g7",
  s8: "s8",
  g8: "g8",
  s9: "s9",
  g9: "g9",
  s10: "s10",
  g10: "g10",
  s11: "s11",
  g11: "g11",
  s12: "s12",
  g12: "g12",
  s13: "s13",
  g13: "g13",
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

  [colorKeys.s1]: [0.62, 0.98, 0.09],
  [colorKeys.g1]: [0.09, 0.15, 0.01],
  [colorKeys.s2]: [0.5, 0.5, 0.5],
  [colorKeys.g2]: [0.5, 0.5, 0.5],
  [colorKeys.s3]: [0.5, 0.5, 0.5],
  [colorKeys.g3]: [0.5, 0.5, 0.5],
  [colorKeys.s4]: [0.5, 0.5, 0.5],
  [colorKeys.g4]: [0.5, 0.5, 0.5],
  [colorKeys.s5]: [0.7, 0.9, 0.5],
  [colorKeys.g5]: [0.5, 0.2, 0.5],
  [colorKeys.s6]: [0.5, 0.7, 0.9],
  [colorKeys.g6]: [0.2, 0.5, 0.2],
  [colorKeys.s7]: [0.5, 0.5, 0.5],
  [colorKeys.g7]: [0.5, 0.5, 0.5],
  [colorKeys.s8]: [0.5, 0.5, 0.5],
  [colorKeys.g8]: [0.5, 0.5, 0.5],
  [colorKeys.s9]: [0.5, 0.5, 0.5],
  [colorKeys.g9]: [0.5, 0.5, 0.5],
  [colorKeys.s10]: [0.5, 0.5, 0.5],
  [colorKeys.g10]: [0.5, 0.5, 0.5],
  [colorKeys.s11]: [0.5, 0.5, 0.5],
  [colorKeys.g11]: [0.5, 0.5, 0.5],
  [colorKeys.s12]: [0.5, 0.5, 0.5],
  [colorKeys.g12]: [0.5, 0.5, 0.5],
  [colorKeys.s13]: [0.5, 0.5, 0.5],
  [colorKeys.g13]: [0.5, 0.5, 0.5],
};
