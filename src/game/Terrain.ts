import { Colors } from "../colors";

export class Terrain {
  skyColor: Colors;
  groundColor: Colors;

  constructor(skyColor: Colors, groundColor: Colors) {
    this.skyColor = skyColor;
    this.groundColor = groundColor;
  }
}
