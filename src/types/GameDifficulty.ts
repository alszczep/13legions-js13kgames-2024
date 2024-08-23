import { type StageConstructor } from "../game/stage/Stage";

export type StageDefinition = Omit<
  StageConstructor,
  "canvasSize" | "loadNextStage" | "startingPlayerPosition"
>;
export type StageModifiers = Pick<
  StageDefinition,
  | "enemyWalkingSpeedMultiplier"
  | "enemyStandingTimeBeforeAttackInMs"
  | "enemyAttackTimeInMs"
  | "enemyAttackCooldownInMs"
  | "enemyMaxHp"
  | "enemyDmg"
  | "spawnMinDistanceFromPlayer"
> & {
  spawnFrequencyRangeInMs: number;
};

export enum GameDifficulty {
  Easy = 0,
  Normal = 1,
  Hard = 2,
  Nightmare = 3,
}
