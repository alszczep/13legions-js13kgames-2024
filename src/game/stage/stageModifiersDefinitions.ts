import { GameDifficulty, StageModifiers } from "../../types/GameDifficulty";

export const stageModifiersDefinitions: Record<GameDifficulty, StageModifiers> =
  {
    [GameDifficulty.Easy]: {
      enemyWalkingSpeedMultiplier: 1,
      enemyAttackTimeInMs: 1,
      enemyAttackCooldownInMs: 1,
      enemyMaxHp: 1,
      enemyDmg: 0.95,
      spawnFrequencyRangeInMs: 1,
      spawnMinDistanceFromPlayer: 1,
      rockSpawnFrequencyInMs: 1,
      rockDmg: 1,
      rockFallingSpeed: 1,
    },
    [GameDifficulty.Normal]: {
      enemyWalkingSpeedMultiplier: 1.05,
      enemyAttackTimeInMs: 0.92,
      enemyAttackCooldownInMs: 0.92,
      enemyMaxHp: 1.15,
      enemyDmg: 1.15,
      spawnFrequencyRangeInMs: 0.95,
      spawnMinDistanceFromPlayer: 0.95,
      rockSpawnFrequencyInMs: 0.95,
      rockDmg: 1.2,
      rockFallingSpeed: 1.1,
    },
    [GameDifficulty.Hard]: {
      enemyWalkingSpeedMultiplier: 1.1,
      enemyAttackTimeInMs: 0.85,
      enemyAttackCooldownInMs: 0.8,
      enemyMaxHp: 1.4,
      enemyDmg: 1.4,
      spawnFrequencyRangeInMs: 0.9,
      spawnMinDistanceFromPlayer: 0.9,
      rockSpawnFrequencyInMs: 0.9,
      rockDmg: 1.4,
      rockFallingSpeed: 1.2,
    },
    [GameDifficulty.Nightmare]: {
      enemyWalkingSpeedMultiplier: 1.2,
      enemyAttackTimeInMs: 0.8,
      enemyAttackCooldownInMs: 0.7,
      enemyMaxHp: 1.6,
      enemyDmg: 1.6,
      spawnFrequencyRangeInMs: 0.85,
      spawnMinDistanceFromPlayer: 0.85,
      rockSpawnFrequencyInMs: 0.85,
      rockDmg: 1.6,
      rockFallingSpeed: 1.3,
    },
  };
