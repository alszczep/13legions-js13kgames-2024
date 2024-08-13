// alternates points, so every 2 elements
export function combinePositionAndTexCords(
  position: number[],
  texCoords: number[]
) {
  // TODO: comment out before build, only useful in development
  if (position.length !== texCoords.length) {
    throw new Error("position and texCoords need to be of the same size");
  }
  if (position.length & 1) {
    throw new Error("position count need to be even");
  }

  let combined = [];
  for (let i = 0; i < position.length; i += 2) {
    combined.push(position[i]);
    combined.push(position[i + 1]);
    combined.push(texCoords[i]);
    combined.push(texCoords[i + 1]);
  }

  return combined;
}
