import { spriteSheetData } from "../assets/spriteSheetData";
import { BaseColors, colorVectors } from "../colors";
import { SPRITE_SIZE_MULTIPLIER } from "../consts";
import {
  doHitboxesOverlap,
  doYHitboxesOverlap,
  isFirstHitboxToTheLeft,
  isFirstHitboxToTheRight,
} from "../helpers/game/hitboxes";
import { randomFromRange } from "../helpers/game/random";
import { DrawCharacterParams } from "../programs/CharacterProgram";
import {
  Dimensions,
  DimensionsAndCoordinates,
} from "../types/DimensionsAndCoordinates";
import { flipLeftRight, LeftRight } from "../types/Directions";
import { Character } from "./Character";

type Hitboxes = {
  body: DimensionsAndCoordinates;
  sword: DimensionsAndCoordinates;
};

export class KnightEnemy extends Character {
  color: BaseColors;

  _attackTimeLeftInMs?: number;
  _attackCooldownLeftInMs?: number;

  _walkingSpeedMultiplier: number;
  _attackTimeInMs: number;
  _attackCooldownInMs: number;

  _knockbackTimeInMs: number;
  _knockbackTimeLeftInMs?: number;
  _knockbackDirection?: LeftRight;
  _knockbackSpeed: number;

  _rightFacingHitboxes: Hitboxes;
  _leftFacingHitboxes: Hitboxes;

  constructor(
    x: number,
    y: number,
    color: BaseColors,
    walkingSpeedMultiplier: number,
    attackTimeInMs: number,
    attackCooldownInMs: number,
    maxHp: number,
    dmg: number
  ) {
    super(spriteSheetData["ks"], spriteSheetData["ka"], x, y, maxHp, dmg);

    this._rightFacingHitboxes = {
      body: {
        x: 8 * SPRITE_SIZE_MULTIPLIER,
        y: 0 * SPRITE_SIZE_MULTIPLIER,
        w: 12 * SPRITE_SIZE_MULTIPLIER,
        h: 16 * SPRITE_SIZE_MULTIPLIER,
      },
      sword: {
        x: 16 * SPRITE_SIZE_MULTIPLIER,
        y: 0 * SPRITE_SIZE_MULTIPLIER,
        w: 8 * SPRITE_SIZE_MULTIPLIER,
        h: 10 * SPRITE_SIZE_MULTIPLIER,
      },
    };
    this._leftFacingHitboxes = {
      body: {
        ...this._rightFacingHitboxes.body,
        x:
          this.spriteStanding.w -
          (this._rightFacingHitboxes.body.x + this._rightFacingHitboxes.body.w),
      },
      sword: {
        ...this._rightFacingHitboxes.sword,
        x:
          this.spriteStanding.w -
          (this._rightFacingHitboxes.sword.x +
            this._rightFacingHitboxes.sword.w),
      },
    };

    this.color = color;
    this._walkingSpeedMultiplier = walkingSpeedMultiplier;
    this._attackTimeInMs = attackTimeInMs;
    this._attackCooldownInMs = attackCooldownInMs;

    this._knockbackTimeInMs = 80;
    this._knockbackSpeed = 1.5;
  }

  getHitboxesOnScene(): Hitboxes {
    const hb =
      this.facing === ">"
        ? this._rightFacingHitboxes
        : this._leftFacingHitboxes;

    const mkHitbox = (hb: DimensionsAndCoordinates) => ({
      ...hb,
      x: this.x + hb.x,
      y: this.y - this.spriteStanding.h + hb.y,
    });

    return {
      body: mkHitbox(hb.body),
      sword: mkHitbox(hb.sword),
    };
  }

  _handleFrameChaseAndAttack(
    deltaTime: number,
    playerHitbox: DimensionsAndCoordinates,
    hitPlayer: (dmg: number, from: LeftRight) => void
  ) {
    const hitboxes = this.getHitboxesOnScene();

    if (this._knockbackTimeLeftInMs !== undefined) {
      this._attackTimeLeftInMs = undefined;
      this._attackCooldownLeftInMs = undefined;
      return;
    }

    if (
      this._attackTimeLeftInMs === undefined &&
      this._attackCooldownLeftInMs === undefined
    ) {
      const walkingDistance = deltaTime * this._walkingSpeedMultiplier;

      if (
        isFirstHitboxToTheLeft(playerHitbox, hitboxes.sword) &&
        (doYHitboxesOverlap(playerHitbox, hitboxes.sword) ||
          playerHitbox.x + playerHitbox.w * 3 < hitboxes.sword.x)
      ) {
        this.facing = "<";
        this.x -= walkingDistance;
      } else if (
        isFirstHitboxToTheRight(playerHitbox, hitboxes.sword) &&
        (doYHitboxesOverlap(playerHitbox, hitboxes.sword) ||
          playerHitbox.x - playerHitbox.w * 2 >
            hitboxes.sword.x + hitboxes.sword.w)
      ) {
        this.facing = ">";
        this.x += walkingDistance;
      } else if (doHitboxesOverlap(playerHitbox, hitboxes.sword)) {
        this._attackCooldownLeftInMs = this._attackCooldownInMs;
      }
    } else if (this._attackTimeLeftInMs !== undefined) {
      this._attackTimeLeftInMs -= deltaTime;
      if (this._attackTimeLeftInMs <= 0) {
        this._attackTimeLeftInMs = undefined;
      }
    } else if (this._attackCooldownLeftInMs !== undefined) {
      this._attackCooldownLeftInMs -= deltaTime;
      if (this._attackCooldownLeftInMs <= 0) {
        this._attackCooldownLeftInMs = undefined;

        if (doHitboxesOverlap(playerHitbox, hitboxes.sword)) {
          this._attackTimeLeftInMs = this._attackTimeInMs;
          hitPlayer(this.dmg, flipLeftRight(this.facing));
        }
      }
    }
  }

  _handleFrameKnockback(deltaTime: number, canvasSize: Dimensions) {
    if (this._knockbackTimeLeftInMs !== undefined) {
      this._knockbackTimeLeftInMs -= deltaTime;

      const knockbackDistance = deltaTime * this._knockbackSpeed;

      if (this._knockbackTimeLeftInMs <= 0) {
        this._knockbackTimeLeftInMs = undefined;
        this._knockbackDirection = undefined;
      } else {
        if (this._knockbackDirection === "<") {
          this.x -= knockbackDistance;
        } else {
          this.x += knockbackDistance;
        }
      }

      if (this.x < 0 || this.x + this.spriteStanding.w > canvasSize.w) {
        this._knockbackTimeLeftInMs = undefined;
        this._knockbackDirection = undefined;
      }
    }
  }

  handleFrame(
    deltaTime: number,
    playerHitbox: DimensionsAndCoordinates,
    hitPlayer: (dmg: number, from: LeftRight) => void,
    canvasSize: Dimensions
  ) {
    this._handleFrameChaseAndAttack(deltaTime, playerHitbox, hitPlayer);
    this._handleFrameKnockback(deltaTime, canvasSize);
  }

  getDrawData(): DrawCharacterParams {
    const sprite =
      this._attackTimeLeftInMs !== undefined
        ? this.spriteAttacking
        : this.spriteStanding;

    return {
      x: this.x,
      y: this.y - sprite.h,
      w: this.spriteStanding.w,
      h: this.spriteStanding.h,
      texCoords: sprite.texCoords,
      grayOffsetColor: colorVectors[this.color],
      flipX: this.facing === "<",
    };
  }

  getHit(dmg: number, from: LeftRight) {
    super.getHit(dmg, from);

    this._knockbackTimeLeftInMs = randomFromRange(
      this._knockbackTimeInMs * 0.9,
      this._knockbackTimeInMs * 1.1
    );
    this._knockbackDirection = flipLeftRight(from);
  }
}
