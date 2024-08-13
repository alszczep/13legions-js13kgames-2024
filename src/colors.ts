export enum FragmentShaderColorsIds {
  Red = 1,
  Green = 2,
  Blue = 3,
}

export function colorIdFor6Vertices(colorId: FragmentShaderColorsIds) {
  return [colorId, colorId, colorId, colorId, colorId, colorId];
}
