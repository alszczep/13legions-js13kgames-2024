import { SpriteData } from "../assets/spriteSheetData";
import { BaseColors, colorVectors } from "../colors";
import { SPRITE_SIZE_MULTIPLIER } from "../consts";
import {
  doHitboxesOverlap,
  isFirstHitboxToTheLeft,
  isFirstHitboxToTheRight,
} from "../helpers/game/hitboxes";
import { DrawCharacterParams } from "../programs/CharacterProgram";
import { DimensionsAndCoordinates } from "../types/DimensionsAndCoordinates";
import { Character } from "./Character";

type Hitboxes = {
  body: DimensionsAndCoordinates;
  sword: DimensionsAndCoordinates;
};

export class Enemy extends Character {
  color: BaseColors;

  _attackTimeLeft?: number = undefined;
  _attackCooldownLeft?: number = undefined;

  _walkingSpeedMultiplier: number;
  _standingTimeBeforeAttackInMs: number;
  _attackTimeInMs: number;
  _attackCooldownInMs: number;

  _rightFacingHitboxes: Hitboxes = {
    body: {
      x: 8 * SPRITE_SIZE_MULTIPLIER,
      y: 0 * SPRITE_SIZE_MULTIPLIER,
      w: 11 * SPRITE_SIZE_MULTIPLIER,
      h: 16 * SPRITE_SIZE_MULTIPLIER,
    },
    sword: {
      x: 16 * SPRITE_SIZE_MULTIPLIER,
      y: 0 * SPRITE_SIZE_MULTIPLIER,
      w: 8 * SPRITE_SIZE_MULTIPLIER,
      h: 10 * SPRITE_SIZE_MULTIPLIER,
    },
  };
  _leftFacingHitboxes: Hitboxes = {} as Hitboxes;

  constructor(
    spriteStanding: SpriteData,
    spriteAttacking: SpriteData,
    x: number,
    y: number,
    color: BaseColors,
    walkingSpeedMultiplier: number,
    standingTimeBeforeAttackInMs: number,
    attackTimeInMs: number,
    attackCooldownInMs: number,
    maxHp: number,
    dmg: number
  ) {
    super(spriteStanding, spriteAttacking, x, y, maxHp, dmg);

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
    this._standingTimeBeforeAttackInMs = standingTimeBeforeAttackInMs;
    this._attackTimeInMs = attackTimeInMs;
    this._attackCooldownInMs = attackCooldownInMs;
  }

  getHitboxesOnScene(): Hitboxes {
    const hb =
      this._facing === "right"
        ? this._rightFacingHitboxes
        : this._leftFacingHitboxes;

    return {
      body: {
        ...hb.body,
        x: this.x + hb.body.x,
        y: this.y - this.spriteStanding.h + hb.body.y,
      },
      sword: {
        ...hb.sword,
        x: this.x + hb.sword.x,
        y: this.y - this.spriteStanding.h + hb.sword.y,
      },
    };
  }

  handleFrame(
    deltaTime: number,
    playerHitbox: DimensionsAndCoordinates,
    hitPlayer: (dmg: number) => void
  ): void {
    const hitboxes = this.getHitboxesOnScene();

    if (
      this._attackTimeLeft === undefined &&
      this._attackCooldownLeft === undefined
    ) {
      if (isFirstHitboxToTheLeft(playerHitbox, hitboxes.sword)) {
        this._facing = "left";
        this.x -= deltaTime * this._walkingSpeedMultiplier;
      } else if (isFirstHitboxToTheRight(playerHitbox, hitboxes.sword)) {
        this._facing = "right";
        this.x += deltaTime * this._walkingSpeedMultiplier;
      } else if (doHitboxesOverlap(playerHitbox, hitboxes.sword)) {
        this._attackCooldownLeft = this._attackCooldownInMs;
      }
    } else if (this._attackTimeLeft !== undefined) {
      this._attackTimeLeft -= deltaTime;
      if (this._attackTimeLeft <= 0) {
        this._attackTimeLeft = undefined;
      }
    } else if (this._attackCooldownLeft !== undefined) {
      this._attackCooldownLeft -= deltaTime;
      if (this._attackCooldownLeft <= 0) {
        this._attackCooldownLeft = undefined;

        if (doHitboxesOverlap(playerHitbox, hitboxes.sword)) {
          this._attackTimeLeft = this._attackTimeInMs;
          hitPlayer(this.dmg);
        }
      }
    }
  }

  getDrawData(): DrawCharacterParams {
    const sprite =
      this._attackTimeLeft !== undefined
        ? this.spriteAttacking
        : this.spriteStanding;

    return {
      x: this.x,
      y: this.y - sprite.h,
      w: this.spriteStanding.w,
      h: this.spriteStanding.h,
      texCoords: sprite.texCoords,
      grayOffsetColor: colorVectors[this.color],
      flipX: this._facing === "left",
    };
  }
}
