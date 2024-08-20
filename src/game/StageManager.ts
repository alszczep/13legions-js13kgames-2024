import { Dimensions } from "../types/DimensionsAndCoordinates";
import { Stage } from "./Stage";
import { mkStageDefinitions } from "./stageDefinitions";

export class StageManager {
  currentStage: Stage;
  currentStageIndex: number = 0;

  stageDefinitions: ReturnType<typeof mkStageDefinitions>;

  constructor(canvasSize: Dimensions) {
    this.stageDefinitions = mkStageDefinitions(canvasSize, this);
    this.currentStage = this.stageDefinitions[this.currentStageIndex]();
  }

  nextStage() {
    this.currentStageIndex++;
    this.currentStage = this.stageDefinitions[this.currentStageIndex]();
  }
}
