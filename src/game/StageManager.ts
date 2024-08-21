import { TERRAIN_FLOOR_HEIGHT } from "../consts";
import { Coordinates, Dimensions } from "../types/DimensionsAndCoordinates";
import { Stage } from "./Stage";
import { mkStageDefinitions } from "./stageDefinitions";

export class StageManager {
  currentStage: Stage;
  currentStageIndex: number = 0;

  stageDefinitions: ReturnType<typeof mkStageDefinitions>;

  constructor(canvasSize: Dimensions) {
    this.stageDefinitions = mkStageDefinitions(canvasSize, this);
    this.currentStage = this.stageDefinitions[this.currentStageIndex]({
      x: canvasSize.w / 2,
      y: canvasSize.h - TERRAIN_FLOOR_HEIGHT,
    });
  }

  nextStage(startingPlayerPosition: Coordinates) {
    this.currentStageIndex++;
    this.currentStage = this.stageDefinitions[this.currentStageIndex](
      startingPlayerPosition
    );
  }
}
