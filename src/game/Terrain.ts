import { Colors, colorVectors } from "../colors";
import { DrawTerrainParams } from "../programs/TerrainProgram";
import { DimensionsAndCoordinates } from "../types/DimensionsAndCoordinates";

export class Terrain {
  skyColor: Colors;
  groundColor: Colors;

  skyRectangle: DimensionsAndCoordinates;
  groundRectangles: DimensionsAndCoordinates[];

  constructor(
    skyColor: Colors,
    groundColor: Colors,
    skyRectangle: DimensionsAndCoordinates,
    groundRectangles: DimensionsAndCoordinates[]
  ) {
    this.skyColor = skyColor;
    this.groundColor = groundColor;
    this.skyRectangle = skyRectangle;
    this.groundRectangles = groundRectangles;
  }

  getDrawData(): DrawTerrainParams[] {
    return [
      {
        ...this.skyRectangle,
        color: colorVectors[this.skyColor],
      },
      ...this.groundRectangles.map((rectangle) => ({
        ...rectangle,
        color: colorVectors[this.groundColor],
      })),
    ];
  }
}
