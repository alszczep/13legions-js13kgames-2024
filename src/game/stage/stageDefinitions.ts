import { colorKeys } from "../../colors";
import { StageDefinition } from "../../types/GameDifficulty";
import { ThirteenElements } from "../../types/ThirteenElements";

export const stageDefinitions: ThirteenElements<StageDefinition> = [
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
    spawnFrequencyRangeInMs: [10, 20],
    spawnMinDistanceFromPlayer: 200,
    terrain: [
      {
        x: 200,
        y: 425,
        w: 200,
        h: 25,
      },
      {
        x: 800,
        y: 425,
        w: 200,
        h: 25,
      },
    ],
    rockSpawnFrequencyInMs: [5000, 7000],
    rockDmg: 20,
    rockFallingSpeed: 0.15,
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
    spawnFrequencyRangeInMs: [10, 20],
    spawnMinDistanceFromPlayer: 200,
    terrain: [
      {
        x: 300,
        y: 425,
        w: 250,
        h: 25,
      },
      {
        x: 650,
        y: 350,
        w: 250,
        h: 25,
      },
    ],
    rockSpawnFrequencyInMs: [5000, 7000],
    rockDmg: 20,
    rockFallingSpeed: 0.15,
  },
  // TODO: add all
] as unknown as ThirteenElements<StageDefinition>;
