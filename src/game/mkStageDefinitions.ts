import { colorKeys } from "../colors";
import { Coordinates, Dimensions } from "../types/DimensionsAndCoordinates";
import type { StageDefinition, StageModifiers } from "../types/GameDifficulty";
import { ThirteenElements } from "../types/ThirteenElements";
import { Stage } from "./Stage";
import { StageManager } from "./StageManager";

export const mkStageDefinitions = (
  canvasSize: Dimensions,
  stageManager: StageManager,
  stageModifiers: StageModifiers
) => {
  const baseArgs = {
    canvasSize: canvasSize,
    loadNextStage: (startingPlayerPosition: Coordinates) =>
      stageManager.nextStage(startingPlayerPosition),
  };

  const mapDefinition =
    (definition: StageDefinition) => (startingPlayerPosition: Coordinates) =>
      new Stage({
        ...baseArgs,
        ...definition,
        startingPlayerPosition,
        enemyWalkingSpeedMultiplier:
          definition.enemyWalkingSpeedMultiplier *
          stageModifiers.enemyWalkingSpeedMultiplier,
        enemyStandingTimeBeforeAttackInMs:
          definition.enemyStandingTimeBeforeAttackInMs *
          stageModifiers.enemyStandingTimeBeforeAttackInMs,
        enemyAttackTimeInMs:
          definition.enemyAttackTimeInMs * stageModifiers.enemyAttackTimeInMs,
        enemyAttackCooldownInMs:
          definition.enemyAttackCooldownInMs *
          stageModifiers.enemyAttackCooldownInMs,
        enemyMaxHp: definition.enemyMaxHp * stageModifiers.enemyMaxHp,
        enemyDmg: definition.enemyDmg * stageModifiers.enemyDmg,
        spawnFrequencyRangeInMs: [
          definition.spawnFrequencyRangeInMs[0] *
            stageModifiers.spawnFrequencyRangeInMs,
          definition.spawnFrequencyRangeInMs[1] *
            stageModifiers.spawnFrequencyRangeInMs,
        ],
        spawnMinDistanceFromPlayer:
          definition.spawnMinDistanceFromPlayer *
          stageModifiers.spawnMinDistanceFromPlayer,
      });

  const definitions: ThirteenElements<StageDefinition> = [
    {
      legionName: "First Legion",
      stageName: "First Stage",
      skyColor: colorKeys.s1,
      groundColor: colorKeys.g1,
      enemyWalkingSpeedMultiplier: 0.2,
      enemyStandingTimeBeforeAttackInMs: 500,
      enemyAttackTimeInMs: 700,
      enemyAttackCooldownInMs: 400,
      enemyMaxHp: 30,
      enemyDmg: 50,
      spawnFrequencyRangeInMs: [100, 200],
      spawnMinDistanceFromPlayer: 200,
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
    },
    {
      legionName: "Second Legion",
      stageName: "Second Stage",
      skyColor: colorKeys.s2,
      groundColor: colorKeys.g2,
      enemyWalkingSpeedMultiplier: 0.2,
      enemyStandingTimeBeforeAttackInMs: 500,
      enemyAttackTimeInMs: 700,
      enemyAttackCooldownInMs: 400,
      enemyMaxHp: 60,
      enemyDmg: 50,
      spawnFrequencyRangeInMs: [100, 200],
      spawnMinDistanceFromPlayer: 200,
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
    },
    // TODO: add all
  ] as unknown as ThirteenElements<StageDefinition>;

  return definitions.map(mapDefinition);
};
