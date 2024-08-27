import { colorKeys } from "../../colors";
import { INFINITE_TIME } from "../../consts";
import { StageDefinition } from "../../types/GameDifficulty";
import { ThirteenElements } from "../../types/ThirteenElements";

export const stageDefinitions: ThirteenElements<StageDefinition> = [
  {
    legionName: "First Legion of Prison Guards",
    stageName: "Prison Sewers",
    skyColor: colorKeys.s1,
    groundColor: colorKeys.g1,
    enemyWalkingSpeedMultiplier: 0.2,
    enemyAttackTimeInMs: 800,
    enemyAttackCooldownInMs: 500,
    enemyMaxHp: 100,
    enemyDmg: 60,
    spawnFrequencyRangeInMs: [2000, 3500],
    spawnMinDistanceFromPlayer: 250,
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
    rockSpawnFrequencyInMs: [4000, 8000],
    rockDmg: 15,
    rockFallingSpeed: 0.15,
  },
  {
    legionName: "Second Legion of Demented Lamplighters",
    stageName: "Unlit Lanterns District",
    skyColor: colorKeys.s2,
    groundColor: colorKeys.g2,
    enemyWalkingSpeedMultiplier: 0.5,
    enemyAttackTimeInMs: 100,
    enemyAttackCooldownInMs: 100,
    enemyMaxHp: 55,
    enemyDmg: 10,
    spawnFrequencyRangeInMs: [1000, 5000],
    spawnMinDistanceFromPlayer: 250,
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
    rockSpawnFrequencyInMs: [INFINITE_TIME, INFINITE_TIME],
    rockDmg: 0,
    rockFallingSpeed: 0,
  },
  {
    legionName: "Third Legion of Asbestos Miners",
    stageName: "Impeccable Caverns",
    skyColor: colorKeys.s3,
    groundColor: colorKeys.g3,
    enemyWalkingSpeedMultiplier: 0.15,
    enemyAttackTimeInMs: 800,
    enemyAttackCooldownInMs: 500,
    enemyMaxHp: 150,
    enemyDmg: 60,
    spawnFrequencyRangeInMs: [3000, 5000],
    spawnMinDistanceFromPlayer: 250,
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
    rockSpawnFrequencyInMs: [500, 1500],
    rockDmg: 100,
    rockFallingSpeed: 0.1,
  },
  {
    legionName: "Fourth Legion of Dark Elves",
    stageName: "Ever-growing Forest",
    skyColor: colorKeys.s4,
    groundColor: colorKeys.g4,
    enemyWalkingSpeedMultiplier: 0.23,
    enemyAttackTimeInMs: 400,
    enemyAttackCooldownInMs: 400,
    enemyMaxHp: 175,
    enemyDmg: 90,
    spawnFrequencyRangeInMs: [2000, 3000],
    spawnMinDistanceFromPlayer: 230,
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
    rockSpawnFrequencyInMs: [INFINITE_TIME, INFINITE_TIME],
    rockDmg: 0,
    rockFallingSpeed: 0,
  },
  {
    legionName: "Fifth Legion of Infected Peasants",
    stageName: "Contaminated Plains",
    skyColor: colorKeys.s5,
    groundColor: colorKeys.g5,
    enemyWalkingSpeedMultiplier: 0.35,
    enemyAttackTimeInMs: 200,
    enemyAttackCooldownInMs: 200,
    enemyMaxHp: 75,
    enemyDmg: 30,
    spawnFrequencyRangeInMs: [2500, 3500],
    spawnMinDistanceFromPlayer: 220,
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
    rockSpawnFrequencyInMs: [INFINITE_TIME, INFINITE_TIME],
    rockDmg: 0,
    rockFallingSpeed: 0,
  },
  {
    legionName: "Sixth Legion of Possessed Monks",
    stageName: "Forsaken Temple",
    skyColor: colorKeys.s6,
    groundColor: colorKeys.g6,
    enemyWalkingSpeedMultiplier: 0.14,
    enemyAttackTimeInMs: 300,
    enemyAttackCooldownInMs: 500,
    enemyMaxHp: 300,
    enemyDmg: 110,
    spawnFrequencyRangeInMs: [2000, 2800],
    spawnMinDistanceFromPlayer: 170,
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
    rockSpawnFrequencyInMs: [3700, 6000],
    rockDmg: 40,
    rockFallingSpeed: 0.18,
  },
  {
    legionName: "Seventh Legion of Ashen Nomads",
    stageName: "Desert of Ashes",
    skyColor: colorKeys.s7,
    groundColor: colorKeys.g7,
    enemyWalkingSpeedMultiplier: 0.25,
    enemyAttackTimeInMs: 400,
    enemyAttackCooldownInMs: 350,
    enemyMaxHp: 190,
    enemyDmg: 95,
    spawnFrequencyRangeInMs: [1800, 3100],
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
    rockSpawnFrequencyInMs: [3700, 5000],
    rockDmg: 60,
    rockFallingSpeed: 0.2,
  },
  {
    legionName: "Eighth Legion of Exiled Prisoners",
    stageName: "Growing Wastelands of Frost",
    skyColor: colorKeys.s8,
    groundColor: colorKeys.g8,
    enemyWalkingSpeedMultiplier: 0.17,
    enemyAttackTimeInMs: 500,
    enemyAttackCooldownInMs: 600,
    enemyMaxHp: 100,
    enemyDmg: 120,
    spawnFrequencyRangeInMs: [4000, 6000],
    spawnMinDistanceFromPlayer: 260,
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
    rockSpawnFrequencyInMs: [600, 700],
    rockDmg: 60,
    rockFallingSpeed: 0.7,
  },
  {
    legionName: "Ninth Legion of Fallen Angels",
    stageName: "Heavenly Peaks",
    skyColor: colorKeys.s9,
    groundColor: colorKeys.g9,
    enemyWalkingSpeedMultiplier: 0.27,
    enemyAttackTimeInMs: 400,
    enemyAttackCooldownInMs: 350,
    enemyMaxHp: 180,
    enemyDmg: 95,
    spawnFrequencyRangeInMs: [2000, 3400],
    spawnMinDistanceFromPlayer: 160,
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
    rockSpawnFrequencyInMs: [INFINITE_TIME, INFINITE_TIME],
    rockDmg: 0,
    rockFallingSpeed: 0,
  },
  {
    legionName: "Tenth Legion of Blinded Wanderers",
    stageName: "Valley of the Dead",
    skyColor: colorKeys.s10,
    groundColor: colorKeys.g10,
    enemyWalkingSpeedMultiplier: 0.1,
    enemyAttackTimeInMs: 1000,
    enemyAttackCooldownInMs: 250,
    enemyMaxHp: 280,
    enemyDmg: 150,
    spawnFrequencyRangeInMs: [500, 800],
    spawnMinDistanceFromPlayer: 400,
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
    rockSpawnFrequencyInMs: [1500, 3000],
    rockDmg: 80,
    rockFallingSpeed: 0.3,
  },
  {
    legionName: "Eleventh Legion of Restless Spirits",
    stageName: "Forgotten Graveyard",
    skyColor: colorKeys.s11,
    groundColor: colorKeys.g11,
    enemyWalkingSpeedMultiplier: 1,
    enemyAttackTimeInMs: 100,
    enemyAttackCooldownInMs: 100,
    enemyMaxHp: 55,
    enemyDmg: 15,
    spawnFrequencyRangeInMs: [3500, 4000],
    spawnMinDistanceFromPlayer: 450,
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
    rockSpawnFrequencyInMs: [INFINITE_TIME, INFINITE_TIME],
    rockDmg: 0,
    rockFallingSpeed: 0,
  },
  {
    legionName: "Twelfth Legion of Bloodthirsty Berserkers",
    stageName: "Desolated Battlegrounds",
    skyColor: colorKeys.s12,
    groundColor: colorKeys.g12,
    enemyWalkingSpeedMultiplier: 0.42,
    enemyAttackTimeInMs: 500,
    enemyAttackCooldownInMs: 310,
    enemyMaxHp: 120,
    enemyDmg: 120,
    spawnFrequencyRangeInMs: [2300, 2900],
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
    rockSpawnFrequencyInMs: [INFINITE_TIME, INFINITE_TIME],
    rockDmg: 0,
    rockFallingSpeed: 0,
  },
  {
    legionName: "Thirteenth Legion of Relentless ...",
    stageName: "Haven of Lost Hope",
    skyColor: colorKeys.s13,
    groundColor: colorKeys.g13,
    enemyWalkingSpeedMultiplier: 0.32,
    enemyAttackTimeInMs: 400,
    enemyAttackCooldownInMs: 290,
    enemyMaxHp: 240,
    enemyDmg: 90,
    spawnFrequencyRangeInMs: [3900, 4400],
    spawnMinDistanceFromPlayer: 180,
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
    rockSpawnFrequencyInMs: [4000, 5000],
    rockDmg: 30,
    rockFallingSpeed: 0.2,
  },
];
