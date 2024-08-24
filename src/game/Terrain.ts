import { Colors, colorVectors } from "../colors";
import { DrawTerrainParams } from "../programs/TerrainProgram";
import { DimensionsAndCoordinates } from "../types/DimensionsAndCoordinates";

export class Terrain {
  _groundColor: Colors;

  _groundRectangles: DimensionsAndCoordinates[];

  constructor(
    groundColor: Colors,
    groundRectangles: DimensionsAndCoordinates[]
  ) {
    this._groundColor = groundColor;
    this._groundRectangles = groundRectangles;
  }

  getDrawData(): DrawTerrainParams[] {
    return this._groundRectangles.map((rectangle) => ({
      ...rectangle,
      color: colorVectors[this._groundColor],
    }));
  }
}
