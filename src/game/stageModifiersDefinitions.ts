import { GameDifficulty, StageModifiers } from "../types/GameDifficulty";

export const stageModifiersDefinitions: Record<GameDifficulty, StageModifiers> =
  {
    [GameDifficulty.Easy]: {
      enemyWalkingSpeedMultiplier: 1,
      enemyStandingTimeBeforeAttackInMs: 1,
      enemyAttackTimeInMs: 1,
      enemyAttackCooldownInMs: 1,
      enemyMaxHp: 1,
      enemyDmg: 1,
      spawnFrequencyRangeInMs: 1,
      spawnMinDistanceFromPlayer: 1,
    },
    [GameDifficulty.Normal]: {
      enemyWalkingSpeedMultiplier: 1.05,
      enemyStandingTimeBeforeAttackInMs: 0.95,
      enemyAttackTimeInMs: 0.9,
      enemyAttackCooldownInMs: 0.9,
      enemyMaxHp: 1.2,
      enemyDmg: 1.2,
      spawnFrequencyRangeInMs: 0.95,
      spawnMinDistanceFromPlayer: 0.95,
    },
    [GameDifficulty.Hard]: {
      enemyWalkingSpeedMultiplier: 1.1,
      enemyStandingTimeBeforeAttackInMs: 0.9,
      enemyAttackTimeInMs: 0.85,
      enemyAttackCooldownInMs: 0.8,
      enemyMaxHp: 1.4,
      enemyDmg: 1.4,
      spawnFrequencyRangeInMs: 0.9,
      spawnMinDistanceFromPlayer: 0.9,
    },
    [GameDifficulty.Nightmare]: {
      enemyWalkingSpeedMultiplier: 1.2,
      enemyStandingTimeBeforeAttackInMs: 0.8,
      enemyAttackTimeInMs: 0.8,
      enemyAttackCooldownInMs: 0.7,
      enemyMaxHp: 1.6,
      enemyDmg: 1.6,
      spawnFrequencyRangeInMs: 0.85,
      spawnMinDistanceFromPlayer: 0.85,
    },
  };
