export type LeftRight = "<" | ">";
export type UpDown = "^" | "v";

export const flipLeftRight = (direction: LeftRight): LeftRight =>
  direction === ">" ? "<" : ">";
