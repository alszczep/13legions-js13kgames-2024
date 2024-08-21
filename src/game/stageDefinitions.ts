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
        legionName: "First Legion",
        stageName: "First Legion of the First Stage",
        skyColor: colorKeys.s1,
        groundColor: colorKeys.g1,
        enemyWalkingSpeedMultiplier: 0.2,
        enemyStandingTimeBeforeAttackInMs: 500,
        enemyAttackTimeInMs: 700,
        enemyAttackCooldownInMs: 400,
        enemyMaxHp: 30,
        enemyDmg: 50,
        spawnFrequencyRangeInMs: [500, 600],
        spawnMinDistanceFromPlayer: 200,
        startingPlayerPosition,
        terrain: [
          {
            x: canvasSize.w / 6,
            y: canvasSize.h - 175,
            w: canvasSize.w / 6,
            h: 25,
          },
          {
            x: canvasSize.w - canvasSize.w / 3,
            y: canvasSize.h - 175,
            w: canvasSize.w / 6,
            h: 25,
          },
        ],
      }),
    (startingPlayerPosition: Coordinates) =>
      new Stage({
        ...baseArgs,
        legionName: "Second Legion",
        stageName: "Second Legion of the Second Stage",
        skyColor: colorKeys.s2,
        groundColor: colorKeys.g2,
        enemyWalkingSpeedMultiplier: 0.2,
        enemyStandingTimeBeforeAttackInMs: 500,
        enemyAttackTimeInMs: 700,
        enemyAttackCooldownInMs: 400,
        enemyMaxHp: 60,
        enemyDmg: 50,
        spawnFrequencyRangeInMs: [5000, 6000],
        spawnMinDistanceFromPlayer: 200,
        startingPlayerPosition,
        terrain: [
          {
            x: canvasSize.w / 4,
            y: canvasSize.h - 175,
            w: canvasSize.w / 6,
            h: 25,
          },
          {
            x: canvasSize.w - canvasSize.w / 2,
            y: canvasSize.h - 250,
            w: canvasSize.w / 6,
            h: 25,
          },
        ],
      }),
    // TODO: add all
  ] as unknown as ThirteenElements<
    (startingPlayerPosition: Coordinates) => Stage
  >;
};
