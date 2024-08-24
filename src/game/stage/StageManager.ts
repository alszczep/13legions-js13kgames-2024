import { TERRAIN_FLOOR_HEIGHT } from "../../consts";
import { Coordinates, Dimensions } from "../../types/DimensionsAndCoordinates";
import { StageModifiers } from "../../types/GameDifficulty";
import { Stage } from "./Stage";
import { mkStageDefinitions } from "./mkStageDefinitions";

export class StageManager {
  currentStage: Stage;
  _currentStageIndex: number;

  _stageDefinitions: ReturnType<typeof mkStageDefinitions>;

  _animateText: (stageName: string, opt?: { keepShown?: boolean }) => void;

  constructor(
    canvasSize: Dimensions,
    animateText: (stageName: string, opt?: { keepShown?: boolean }) => void,
    stageModifiers: StageModifiers
  ) {
    this._stageDefinitions = mkStageDefinitions(
      canvasSize,
      this,
      stageModifiers
    );
    this._currentStageIndex = 0;

    this.currentStage = this._stageDefinitions[this._currentStageIndex]({
      x: canvasSize.w / 2,
      y: canvasSize.h - TERRAIN_FLOOR_HEIGHT,
    });

    this._animateText = animateText;
    this._animateText(this.currentStage.stageName);
  }

  nextStage(startingPlayerPosition: Coordinates) {
    this._currentStageIndex++;

    if (this._stageDefinitions[this._currentStageIndex] === undefined) {
      this._animateText("Victory", { keepShown: true });
    } else {
      this.currentStage = this._stageDefinitions[this._currentStageIndex](
        startingPlayerPosition
      );
      this._animateText(this.currentStage.stageName);
    }
  }
}
