import { colorKeys } from "../colors";
import { Coordinates, Dimensions } from "../types/DimensionsAndCoordinates";
import { ThirteenElements } from "../types/ThirteenElements";
import { Stage } from "./Stage";
import { StageManager } from "./StageManager";

export const mkStageDefinitions = (
  canvasSize: Dimensions,
  stageManager: StageManager
): ThirteenElements<(startingPlayerPosition: Coordinates) => Stage> => {
  const baseArgs = {
    canvasSize: canvasSize,
    loadNextStage: (startingPlayerPosition: Coordinates) =>
      stageManager.nextStage(startingPlayerPosition),
  };

  return [
    (startingPlayerPosition: Coordinates) =>
      new Stage({
        ...baseArgs,
        skyColor: colorKeys.sky,
        groundColor: colorKeys.ground,
        enemyWalkingSpeedMultiplier: 0.2,
        enemyStandingTimeBeforeAttackInMs: 500,
        enemyAttackTimeInMs: 700,
        enemyAttackCooldownInMs: 400,
        enemyMaxHp: 30,
        enemyDmg: 50,
        spawnFrequencyRangeInMs: [500, 600],
        spawnMinDistanceFromPlayer: 200,
        startingPlayerPosition,
      }),
    (startingPlayerPosition: Coordinates) =>
      new Stage({
        ...baseArgs,
        skyColor: colorKeys.sky,
        groundColor: colorKeys.ground,
        enemyWalkingSpeedMultiplier: 0.2,
        enemyStandingTimeBeforeAttackInMs: 500,
        enemyAttackTimeInMs: 700,
        enemyAttackCooldownInMs: 400,
        enemyMaxHp: 60,
        enemyDmg: 50,
        spawnFrequencyRangeInMs: [5000, 6000],
        spawnMinDistanceFromPlayer: 200,
        startingPlayerPosition,
      }),
    // TODO: add all
  ] as unknown as ThirteenElements<
    (startingPlayerPosition: Coordinates) => Stage
  >;
};
