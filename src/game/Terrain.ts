import { Colors, colorVectors } from "../colors";
import { DrawTerrainParams } from "../programs/TerrainProgram";
import { DimensionsAndCoordinates } from "../types/DimensionsAndCoordinates";

export class Terrain {
  groundColor: Colors;

  groundRectangles: DimensionsAndCoordinates[];

  constructor(
    groundColor: Colors,
    groundRectangles: DimensionsAndCoordinates[]
  ) {
    this.groundColor = groundColor;
    this.groundRectangles = groundRectangles;
  }

  getDrawData(): DrawTerrainParams[] {
    return this.groundRectangles.map((rectangle) => ({
      ...rectangle,
      color: colorVectors[this.groundColor],
    }));
  }
}
