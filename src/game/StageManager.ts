import { TERRAIN_FLOOR_HEIGHT } from "../consts";
import { Coordinates, Dimensions } from "../types/DimensionsAndCoordinates";
import { StageModifiers } from "../types/GameDifficulty";
import { Stage } from "./Stage";
import { mkStageDefinitions } from "./mkStageDefinitions";

export class StageManager {
  currentStage: Stage;
  currentStageIndex: number = 0;

  stageDefinitions: ReturnType<typeof mkStageDefinitions>;

  animateText: (stageName: string, opt?: { keepShown?: boolean }) => void;

  constructor(
    canvasSize: Dimensions,
    animateText: (stageName: string, opt?: { keepShown?: boolean }) => void,
    stageModifiers: StageModifiers
  ) {
    this.stageDefinitions = mkStageDefinitions(
      canvasSize,
      this,
      stageModifiers
    );
    this.currentStage = this.stageDefinitions[this.currentStageIndex]({
      x: canvasSize.w / 2,
      y: canvasSize.h - TERRAIN_FLOOR_HEIGHT,
    });

    this.animateText = animateText;
    this.animateText(this.currentStage.stageName);
  }

  nextStage(startingPlayerPosition: Coordinates) {
    this.currentStageIndex++;

    if (this.stageDefinitions[this.currentStageIndex] === undefined) {
      this.animateText("Victory", { keepShown: true });
    } else {
      this.currentStage = this.stageDefinitions[this.currentStageIndex](
        startingPlayerPosition
      );
      this.animateText(this.currentStage.stageName);
    }
  }
}
