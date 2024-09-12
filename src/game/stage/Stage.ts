import { spriteSheetData } from "../../assets/spriteSheetData";
import { BaseColors, Colors, colorVectors } from "../../colors";
import {
  STAGE_START_AND_END_TIME_OFFSET_IN_MS,
  TERRAIN_FLOOR_HEIGHT,
  TOP_BAR_ANIMATION_TIME_IN_MS,
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
import { LeftRight } from "../../types/Directions";
import { KnightEnemy } from "../KnightEnemy";
import { Player } from "../Player";
import { Rock } from "../Rock";
import { Terrain } from "../Terrain";

const knightsPerStage = 13;

export type StageConstructor = {
  canvasSize: Dimensions;
  loadNextStage: (startingPlayerPosition: Coordinates) => void;
  legionName: string;
  stageName: string;
  skyColor: Colors;
  oldSkyColor: Colors;
  groundColor: Colors;
  enemyWalkingSpeedMultiplier: number;
  enemyAttackTimeInMs: number;
  enemyAttackCooldownInMs: number;
  enemyMaxHp: number;
  enemyDmg: number;
  spawnFrequencyRangeInMs: [number, number];
  spawnMinDistanceFromPlayer: number;
  startingPlayerPosition: Coordinates;
  terrain: DimensionsAndCoordinates[];
  rockSpawnFrequencyInMs: [number, number];
  rockDmg: number;
  rockFallingSpeed: number;
};

export class Stage {
  canvasSize: Dimensions;
  _loadNextStage: (startingPlayerPosition: Coordinates) => void;

  legionName: string;
  stageName: string;

  currentSkyColor: Colors;
  _oldSkyColor: Colors;
  displayedSkyColor: [number, number, number];
  _colorsDifference: [number, number, number];
  _colorChangeTimeInMs = TOP_BAR_ANIMATION_TIME_IN_MS * 1.75;
  _colorChangeTimeLeftInMs: number;

  terrain: Terrain;

  player: Player;
  knightEnemies: KnightEnemy[];

  _spawnedKnights: number;
  _timeUntilNextKnightSpawn: number;

  _enemyWalkingSpeedMultiplier: number;
  _enemyAttackTimeInMs: number;
  _enemyAttackCooldownInMs: number;
  _enemyMaxHp: number;
  _enemyDmg: number;

  _spawnFrequencyRangeInMs: [number, number];
  _spawnMinDistanceFromPlayer: number;

  _rockSpawnFrequencyInMs: [number, number];
  _timeUntilNextRockSpawn: number;
  _rockDmg: number;
  _rockFallingSpeed: number;
  rocksMap: Map<string, Rock>;

  _nextLevelCooldown?: number;

  _nextStageLoaded;

  constructor({
    canvasSize,
    loadNextStage,
    legionName,
    stageName,
    skyColor,
    oldSkyColor,
    groundColor,
    enemyWalkingSpeedMultiplier,
    enemyAttackTimeInMs,
    enemyAttackCooldownInMs,
    enemyMaxHp,
    enemyDmg,
    spawnFrequencyRangeInMs,
    spawnMinDistanceFromPlayer,
    startingPlayerPosition,
    terrain,
    rockSpawnFrequencyInMs,
    rockDmg,
    rockFallingSpeed,
  }: StageConstructor) {
    this.canvasSize = canvasSize;
    this._loadNextStage = loadNextStage;

    this.legionName = legionName;
    this.stageName = stageName;

    this.knightEnemies = [];
    this._spawnedKnights = 0;
    this._timeUntilNextKnightSpawn = STAGE_START_AND_END_TIME_OFFSET_IN_MS;

    this.currentSkyColor = skyColor;
    this._oldSkyColor = oldSkyColor;
    this.displayedSkyColor = colorVectors[oldSkyColor];
    this._colorsDifference = [
      colorVectors[skyColor][0] - colorVectors[oldSkyColor][0],
      colorVectors[skyColor][1] - colorVectors[oldSkyColor][1],
      colorVectors[skyColor][2] - colorVectors[oldSkyColor][2],
    ];
    this._colorChangeTimeLeftInMs = this._colorChangeTimeInMs;

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

    this._enemyWalkingSpeedMultiplier = enemyWalkingSpeedMultiplier;
    this._enemyAttackTimeInMs = enemyAttackTimeInMs;
    this._enemyAttackCooldownInMs = enemyAttackCooldownInMs;
    this._enemyMaxHp = enemyMaxHp;
    this._enemyDmg = enemyDmg;

    this._spawnFrequencyRangeInMs = spawnFrequencyRangeInMs;
    this._spawnMinDistanceFromPlayer = spawnMinDistanceFromPlayer;

    this._rockSpawnFrequencyInMs = rockSpawnFrequencyInMs;
    this._timeUntilNextRockSpawn = STAGE_START_AND_END_TIME_OFFSET_IN_MS * 1.2;
    this._rockDmg = rockDmg;
    this._rockFallingSpeed = rockFallingSpeed;
    this.rocksMap = new Map();

    this._nextStageLoaded = false;
  }

  spawnKnight(x: number, color: BaseColors) {
    this._spawnedKnights++;
    this.knightEnemies.push(
      new KnightEnemy(
        x,
        this.canvasSize.h - TERRAIN_FLOOR_HEIGHT,
        color,
        this._enemyWalkingSpeedMultiplier,
        this._enemyAttackTimeInMs,
        this._enemyAttackCooldownInMs,
        this._enemyMaxHp,
        this._enemyDmg
      )
    );
  }

  _handleCharactersFrames(deltaTime: number) {
    this.player.handleFrame(
      deltaTime,
      this.terrain,
      this.knightEnemies.map((e) => ({
        hitbox: e.getHitboxesOnScene().body,
        hit: (dmg: number, from: LeftRight) => e.getHit(dmg, from),
        color: e.color,
      })),
      this.canvasSize
    );
    this.knightEnemies = this.knightEnemies.filter(
      (enemy) => enemy._currentHp > 0
    );
    this.knightEnemies.forEach((enemy) => {
      enemy.handleFrame(
        deltaTime,
        this.player.getHitboxesOnScene().body,
        (dmg: number, from: LeftRight) => this.player.getHit(dmg, from),
        this.canvasSize
      );
    });
    this.rocksMap.forEach((rock) => {
      rock.handleFrame(
        deltaTime,
        this.player.getHitboxesOnScene().body,
        (dmg: number) => this.player.getHit(dmg),
        this.canvasSize
      );
    });
  }

  _handleKnightsSpawn(deltaTime: number) {
    this._timeUntilNextKnightSpawn -= deltaTime;

    if (
      this._timeUntilNextKnightSpawn <= 0 &&
      this._spawnedKnights < knightsPerStage
    ) {
      this._timeUntilNextKnightSpawn = randomFromRange(
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
        x = randomFromRange(
          this.canvasSize.w - spaceRight - spriteSheetData["ks"].w,
          this.canvasSize.w - spriteSheetData["ks"].w
        );
      }

      this.spawnKnight(x, randomBaseColor());
    }
  }

  _handleRocksSpawn(deltaTime: number) {
    this._timeUntilNextRockSpawn -= deltaTime;

    if (this._timeUntilNextRockSpawn <= 0 && !this._nextStageLoaded) {
      this._timeUntilNextRockSpawn = randomFromRange(
        ...this._rockSpawnFrequencyInMs
      );

      const x = randomFromRange(0, this.canvasSize.w - spriteSheetData["r"].w);
      const spawnTimestamp = performance.now().toString();

      const rock = new Rock(x, 0, this._rockDmg, this._rockFallingSpeed, () => {
        this.rocksMap.delete(spawnTimestamp);
      });

      this.rocksMap.set(spawnTimestamp, rock);
    }
  }

  _handleNextLevelCooldown(deltaTime: number, animateStageEnd: () => void) {
    if (
      this._timeUntilNextKnightSpawn <= 0 &&
      this._spawnedKnights >= knightsPerStage &&
      this.knightEnemies.length === 0 &&
      this._nextLevelCooldown === undefined
    ) {
      this._nextLevelCooldown = STAGE_START_AND_END_TIME_OFFSET_IN_MS;
      animateStageEnd();
    }

    if (this._nextLevelCooldown !== undefined && !this._nextStageLoaded) {
      this._nextLevelCooldown -= deltaTime;

      if (this._nextLevelCooldown <= 0) {
        this._loadNextStage({ x: this.player.x, y: this.player.y });
        // needed for the last stage
        this._nextStageLoaded = true;
      }
    }
  }

  _handleSkyColorChange(deltaTime: number) {
    if (this._colorChangeTimeLeftInMs > 0) {
      this._colorChangeTimeLeftInMs -= deltaTime;
      this.displayedSkyColor = [
        this.displayedSkyColor[0] +
          this._colorsDifference[0] * (deltaTime / this._colorChangeTimeInMs),
        this.displayedSkyColor[1] +
          this._colorsDifference[1] * (deltaTime / this._colorChangeTimeInMs),
        this.displayedSkyColor[2] +
          this._colorsDifference[2] * (deltaTime / this._colorChangeTimeInMs),
      ];
    } else {
      this.displayedSkyColor = colorVectors[this.currentSkyColor];
    }
  }

  handleFrame(deltaTime: number, animateStageEnd: () => void) {
    this._handleCharactersFrames(deltaTime);
    this._handleKnightsSpawn(deltaTime);
    this._handleRocksSpawn(deltaTime);
    this._handleNextLevelCooldown(deltaTime, animateStageEnd);
    this._handleSkyColorChange(deltaTime);
  }
}
