import { BaseColors, Colors } from "../colors";
import { TERRAIN_FLOOR_HEIGHT } from "../consts";
import {
  randomBaseColor,
  randomFromRange,
  randomOneOfTwoWeighted,
} from "../helpers/game/random";
import { Dimensions } from "../types/DimensionsAndCoordinates";
import { KnightEnemy } from "./KnightEnemy";
import { Player } from "./Player";
import { Terrain } from "./Terrain";

const knightsPerStage = 13;

export class Stage {
  canvasSize: Dimensions;
  skyColor: Colors;
  terrain: Terrain;

  player: Player;
  knightEnemies: KnightEnemy[] = [];

  _spawnedKnights: number = 0;
  _timeUntilNextSpawn: number = 3000;

  _enemyWalkingSpeedMultiplier: number;
  _enemyStandingTimeBeforeAttackInMs: number;
  _enemyAttackTimeInMs: number;
  _enemyAttackCooldownInMs: number;
  _enemyMaxHp: number;
  _enemyDmg: number;

  _spawnFrequencyRangeInMs: [number, number];
  _spawnMinDistanceFromPlayer: number;

  constructor(
    canvasSize: Dimensions,
    skyColor: Colors,
    groundColor: Colors,
    enemyWalkingSpeedMultiplier: number,
    enemyStandingTimeBeforeAttackInMs: number,
    enemyAttackTimeInMs: number,
    enemyAttackCooldownInMs: number,
    enemyMaxHp: number,
    enemyDmg: number,
    spawnFrequencyRangeInMs: [number, number],
    spawnMinDistanceFromPlayer: number
  ) {
    this.canvasSize = canvasSize;
    this.skyColor = skyColor;
    this.terrain = new Terrain(groundColor, [
      {
        x: 0,
        y: canvasSize.h - TERRAIN_FLOOR_HEIGHT,
        w: canvasSize.w,
        h: TERRAIN_FLOOR_HEIGHT,
      },
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
    ]);

    this.player = new Player(
      canvasSize.w / 2,
      canvasSize.h - TERRAIN_FLOOR_HEIGHT
    );

    this._enemyWalkingSpeedMultiplier = enemyWalkingSpeedMultiplier;
    this._enemyStandingTimeBeforeAttackInMs = enemyStandingTimeBeforeAttackInMs;
    this._enemyAttackTimeInMs = enemyAttackTimeInMs;
    this._enemyAttackCooldownInMs = enemyAttackCooldownInMs;
    this._enemyMaxHp = enemyMaxHp;
    this._enemyDmg = enemyDmg;

    this._spawnFrequencyRangeInMs = spawnFrequencyRangeInMs;
    this._spawnMinDistanceFromPlayer = spawnMinDistanceFromPlayer;
  }

  spawnKnight(x: number, color: BaseColors) {
    this._spawnedKnights++;
    this.knightEnemies.push(
      new KnightEnemy(
        x,
        this.canvasSize.h - TERRAIN_FLOOR_HEIGHT,
        color,
        this._enemyWalkingSpeedMultiplier,
        this._enemyStandingTimeBeforeAttackInMs,
        this._enemyAttackTimeInMs,
        this._enemyAttackCooldownInMs,
        this._enemyMaxHp,
        this._enemyDmg
      )
    );
  }

  handleFrame(deltaTime: number) {
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

    this._timeUntilNextSpawn -= deltaTime;

    if (
      this._timeUntilNextSpawn <= 0 &&
      this._spawnedKnights < knightsPerStage
    ) {
      this._timeUntilNextSpawn = randomFromRange(
        ...this._spawnFrequencyRangeInMs
      );

      const hb = this.player.getHitboxesOnScene().body;

      let spaceLeft = hb.x - this._spawnMinDistanceFromPlayer;
      spaceLeft = spaceLeft < 0 ? 0 : spaceLeft;
      let spaceRight =
        this.canvasSize.w - (hb.x + hb.w + this._spawnMinDistanceFromPlayer);
      spaceRight = spaceRight < 0 ? 0 : spaceRight;

      const chosenSide = randomOneOfTwoWeighted(spaceLeft, spaceRight);

      let x = 0;
      if (chosenSide === "l") {
        x = randomFromRange(0, spaceLeft);
      } else {
        x = randomFromRange(this.canvasSize.w - spaceRight, this.canvasSize.w);
      }

      this.spawnKnight(x, randomBaseColor());
    }
  }
}
