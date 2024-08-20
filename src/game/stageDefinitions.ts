import { colorKeys } from "../colors";
import { Dimensions } from "../types/DimensionsAndCoordinates";
import { ThirteenElements } from "../types/ThirteenElements";
import { Stage } from "./Stage";
import { StageManager } from "./StageManager";

export const mkStageDefinitions = (
  canvasSize: Dimensions,
  stageManager: StageManager
): ThirteenElements<() => Stage> => {
  const baseArgs = [canvasSize, () => stageManager.nextStage()] as const;

  return [
    () =>
      new Stage(
        ...baseArgs,
        colorKeys.sky,
        colorKeys.ground,
        0.2,
        500,
        700,
        400,
        30,
        50,
        [500, 600],
        200
      ),
    () =>
      new Stage(
        ...baseArgs,
        colorKeys.sky,
        colorKeys.ground,
        0.2,
        500,
        700,
        400,
        60,
        50,
        [5000, 6000],
        200
      ),
    // TODO: add all
  ] as unknown as ThirteenElements<() => Stage>;
};
