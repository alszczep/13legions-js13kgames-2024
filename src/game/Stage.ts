import { SpriteData } from "../assets/spriteSheetData";
import { BaseColors, Colors } from "../colors";
import { TERRAIN_FLOOR_HEIGHT } from "../consts";
import { Dimensions } from "../types/DimensionsAndCoordinates";
import { Enemy } from "./Enemy";
import { Player } from "./Player";
import { Terrain } from "./Terrain";

export class Stage {
  canvasSize: Dimensions;
  terrain: Terrain;

  player: Player;
  enemies: Enemy[] = [];

  enemyWalkingSpeedMultiplier: number;
  enemyStandingTimeBeforeAttackInMs: number;
  enemyAttackTimeInMs: number;

  constructor(
    canvasSize: Dimensions,
    skyColor: Colors,
    groundColor: Colors,
    enemyWalkingSpeedMultiplier: number,
    enemyStandingTimeBeforeAttackInMs: number,
    enemyAttackTimeInMs: number
  ) {
    this.canvasSize = canvasSize;
    this.terrain = new Terrain(skyColor, groundColor);

    this.player = new Player(
      canvasSize.w / 2,
      canvasSize.h - TERRAIN_FLOOR_HEIGHT
    );

    this.enemyWalkingSpeedMultiplier = enemyWalkingSpeedMultiplier;
    this.enemyStandingTimeBeforeAttackInMs = enemyStandingTimeBeforeAttackInMs;
    this.enemyAttackTimeInMs = enemyAttackTimeInMs;
  }

  spawnEnemy(
    spriteStanding: SpriteData,
    spriteAttacking: SpriteData,
    x: number,
    y: number,
    color: BaseColors
  ) {
    this.enemies.push(
      new Enemy(
        spriteStanding,
        spriteAttacking,
        x,
        y,
        color,
        this.enemyWalkingSpeedMultiplier,
        this.enemyStandingTimeBeforeAttackInMs,
        this.enemyAttackTimeInMs
      )
    );
  }
}
