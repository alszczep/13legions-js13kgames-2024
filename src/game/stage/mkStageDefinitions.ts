import { Coordinates, Dimensions } from "../../types/DimensionsAndCoordinates";
import type {
  StageDefinition,
  StageModifiers,
} from "../../types/GameDifficulty";
import { Stage } from "./Stage";
import { stageDefinitions } from "./stageDefinitions";
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
        rockSpawnFrequencyInMs: [
          definition.rockSpawnFrequencyInMs[0] *
            stageModifiers.rockSpawnFrequencyInMs,
          definition.rockSpawnFrequencyInMs[1] *
            stageModifiers.rockSpawnFrequencyInMs,
        ],
        rockDmg: definition.rockDmg * stageModifiers.rockDmg,
        rockFallingSpeed:
          definition.rockFallingSpeed * stageModifiers.rockFallingSpeed,
      });

  return stageDefinitions.map(mapDefinition);
};
