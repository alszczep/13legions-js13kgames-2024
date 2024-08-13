// input: {
//     elementsPerVertex: [2, 2, 4],
//     values: [
//         [1, 1, 2, 2],
//         [3, 3, 4, 4],
//         [5, 5, 6, 6, 7, 7, 8, 8]
//     ]
// }
// output: [1, 1, 3, 3, 5, 5, 6, 6, 2, 2, 4, 4, 7, 7, 8, 8]
export function combineVertexAttributeValues({
  elementsPerVertex,
  values,
}: {
  elementsPerVertex: number[];
  values: number[][];
}) {
  // TODO: comment before build
  // not a comprehensive validation, but will do for stupid mistakes
  if (elementsPerVertex.length !== values.length) {
    throw new Error("elementsPerVertex and values need to be of the same size");
  }
  elementsPerVertex.forEach((e, i) => {
    if (values[i].length % e !== 0) {
      throw new Error("elementsPerVertex value has to match values contents");
    }
  });

  let combined: number[] = [];
  for (
    let vertex = 0;
    vertex < values[0].length / elementsPerVertex[0];
    vertex++
  ) {
    elementsPerVertex.forEach((e, i) => {
      for (let j = 0; j < e; j++) {
        combined.push(values[i][vertex * e + j]);
      }
    });
  }

  return combined;
}
