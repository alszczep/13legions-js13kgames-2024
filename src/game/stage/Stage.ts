import { BaseColors, Colors } from "../../colors";
import {
  STAGE_START_AND_END_TIME_OFFSET_IN_MS,
  TERRAIN_FLOOR_HEIGHT,
} from "../../consts";
import {
  randomBaseColor,
  randomFromRange,
  randomOneOfTwoWeighted,
} from "../../helpers/game/random";
import {
  Coordinates,
  Dimensions,
  DimensionsAndCoordinates,
} from "../../types/DimensionsAndCoordinates";
import { KnightEnemy } from "../KnightEnemy";
import { Player } from "../Player";
import { Terrain } from "../Terrain";

const knightsPerStage = 13;
export type StageConstructor = {
  canvasSize: Dimensions;
  loadNextStage: (startingPlayerPosition: Coordinates) => void;
  legionName: string;
  stageName: string;
  skyColor: Colors;
  groundColor: Colors;
  enemyWalkingSpeedMultiplier: number;
  enemyStandingTimeBeforeAttackInMs: number;
  enemyAttackTimeInMs: number;
  enemyAttackCooldownInMs: number;
  enemyMaxHp: number;
  enemyDmg: number;
  spawnFrequencyRangeInMs: [number, number];
  spawnMinDistanceFromPlayer: number;
  startingPlayerPosition: Coordinates;
  terrain: DimensionsAndCoordinates[];
};

export class Stage {
  canvasSize: Dimensions;
  loadNextStage: (startingPlayerPosition: Coordinates) => void;

  legionName: string;
  stageName: string;

  skyColor: Colors;
  terrain: Terrain;

  player: Player;
  knightEnemies: KnightEnemy[];

  spawnedKnights: number;
  timeUntilNextSpawn: number;

  enemyWalkingSpeedMultiplier: number;
  enemyStandingTimeBeforeAttackInMs: number;
  enemyAttackTimeInMs: number;
  enemyAttackCooldownInMs: number;
  enemyMaxHp: number;
  enemyDmg: number;

  spawnFrequencyRangeInMs: [number, number];
  spawnMinDistanceFromPlayer: number;

  nextLevelCooldown?: number;

  constructor({
    canvasSize,
    loadNextStage,
    legionName,
    stageName,
    skyColor,
    groundColor,
    enemyWalkingSpeedMultiplier,
    enemyStandingTimeBeforeAttackInMs,
    enemyAttackTimeInMs,
    enemyAttackCooldownInMs,
    enemyMaxHp,
    enemyDmg,
    spawnFrequencyRangeInMs,
    spawnMinDistanceFromPlayer,
    startingPlayerPosition,
    terrain,
  }: StageConstructor) {
    this.canvasSize = canvasSize;
    this.loadNextStage = loadNextStage;

    this.legionName = legionName;
    this.stageName = stageName;

    this.knightEnemies = [];
    this.spawnedKnights = 0;
    this.timeUntilNextSpawn = STAGE_START_AND_END_TIME_OFFSET_IN_MS;

    this.skyColor = skyColor;
    this.terrain = new Terrain(groundColor, [
      {
        x: 0,
        y: canvasSize.h - TERRAIN_FLOOR_HEIGHT,
        w: canvasSize.w,
        h: TERRAIN_FLOOR_HEIGHT,
      },
      ...terrain,
    ]);

    this.player = new Player(
      startingPlayerPosition.x,
      startingPlayerPosition.y
    );

    this.enemyWalkingSpeedMultiplier = enemyWalkingSpeedMultiplier;
    this.enemyStandingTimeBeforeAttackInMs = enemyStandingTimeBeforeAttackInMs;
    this.enemyAttackTimeInMs = enemyAttackTimeInMs;
    this.enemyAttackCooldownInMs = enemyAttackCooldownInMs;
    this.enemyMaxHp = enemyMaxHp;
    this.enemyDmg = enemyDmg;

    this.spawnFrequencyRangeInMs = spawnFrequencyRangeInMs;
    this.spawnMinDistanceFromPlayer = spawnMinDistanceFromPlayer;
  }

  spawnKnight(x: number, color: BaseColors) {
    this.spawnedKnights++;
    this.knightEnemies.push(
      new KnightEnemy(
        x,
        this.canvasSize.h - TERRAIN_FLOOR_HEIGHT,
        color,
        this.enemyWalkingSpeedMultiplier,
        this.enemyStandingTimeBeforeAttackInMs,
        this.enemyAttackTimeInMs,
        this.enemyAttackCooldownInMs,
        this.enemyMaxHp,
        this.enemyDmg
      )
    );
  }

  handleFrame(deltaTime: number, animateStageEnd: () => void) {
    this.player.handleFrame(
      deltaTime,
      this.terrain,
      this.knightEnemies.map((e) => ({
        hitbox: e.getHitboxesOnScene().body,
        hit: (dmg: number) => e.getHit(dmg),
        color: e.color,
      })),
      this.canvasSize
    );
    this.knightEnemies = this.knightEnemies.filter(
      (enemy) => enemy.currentHp > 0
    );
    this.knightEnemies.forEach((enemy) => {
      enemy.handleFrame(
        deltaTime,
        this.player.getHitboxesOnScene().body,
        (dmg: number) => this.player.getHit(dmg)
      );
    });

    this.timeUntilNextSpawn -= deltaTime;

    if (this.timeUntilNextSpawn <= 0) {
      if (this.spawnedKnights < knightsPerStage) {
        this.timeUntilNextSpawn = randomFromRange(
          ...this.spawnFrequencyRangeInMs
        );

        const hb = this.player.getHitboxesOnScene().body;

        let spaceLeft = hb.x - this.spawnMinDistanceFromPlayer;
        spaceLeft = spaceLeft < 0 ? 0 : spaceLeft;
        let spaceRight =
          this.canvasSize.w - (hb.x + hb.w + this.spawnMinDistanceFromPlayer);
        spaceRight = spaceRight < 0 ? 0 : spaceRight;

        const chosenSide = randomOneOfTwoWeighted(spaceLeft, spaceRight);

        let x = 0;
        if (chosenSide === "l") {
          x = randomFromRange(0, spaceLeft);
        } else {
          x = randomFromRange(
            this.canvasSize.w - spaceRight,
            this.canvasSize.w
          );
        }

        this.spawnKnight(x, randomBaseColor());
      } else if (
        this.spawnedKnights >= knightsPerStage &&
        this.knightEnemies.length === 0 &&
        this.nextLevelCooldown === undefined
      ) {
        this.nextLevelCooldown = STAGE_START_AND_END_TIME_OFFSET_IN_MS;
        animateStageEnd();
      }
    }

    if (this.nextLevelCooldown !== undefined) {
      this.nextLevelCooldown -= deltaTime;
      if (this.nextLevelCooldown <= 0) {
        this.loadNextStage({ x: this.player.x, y: this.player.y });
      }
    }
  }
}
