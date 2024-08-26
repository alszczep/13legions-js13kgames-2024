import { type StageConstructor } from "../game/stage/Stage";

export type StageDefinition = Omit<
  StageConstructor,
  "canvasSize" | "loadNextStage" | "startingPlayerPosition"
>;
export type StageModifiers = Pick<
  StageDefinition,
  | "enemyWalkingSpeedMultiplier"
  | "enemyAttackTimeInMs"
  | "enemyAttackCooldownInMs"
  | "enemyMaxHp"
  | "enemyDmg"
  | "spawnMinDistanceFromPlayer"
  | "rockDmg"
  | "rockFallingSpeed"
> & {
  spawnFrequencyRangeInMs: number;
  rockSpawnFrequencyInMs: number;
};

export enum GameDifficulty {
  Easy = 0,
  Normal = 1,
  Hard = 2,
  Nightmare = 3,
}
