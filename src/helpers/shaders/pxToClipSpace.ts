export const pxToClipSpace = (
  a_position: string,
  u_resolution: string
) => `vec2 scaledPosition = ${a_position};
vec2 zeroToOne = scaledPosition / ${u_resolution};
vec2 zeroToTwo = zeroToOne * 2.0;
vec2 clipSpace = zeroToTwo - 1.0;
gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);`;
