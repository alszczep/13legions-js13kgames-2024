import { spriteSheetData } from "../assets/spriteSheetData";
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

export class KnightEnemy extends Character {
  color: BaseColors;

  attackTimeLeft?: number = undefined;
  attackCooldownLeft?: number = undefined;

  walkingSpeedMultiplier: number;
  standingTimeBeforeAttackInMs: number;
  attackTimeInMs: number;
  attackCooldownInMs: number;

  rightFacingHitboxes: Hitboxes = {
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
  leftFacingHitboxes: Hitboxes = {} as Hitboxes;

  constructor(
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
    super(
      spriteSheetData["enemy-knight 0.aseprite"],
      spriteSheetData["enemy-knight 1.aseprite"],
      x,
      y,
      maxHp,
      dmg
    );

    this.leftFacingHitboxes = {
      body: {
        ...this.rightFacingHitboxes.body,
        x:
          this.spriteStanding.w -
          (this.rightFacingHitboxes.body.x + this.rightFacingHitboxes.body.w),
      },
      sword: {
        ...this.rightFacingHitboxes.sword,
        x:
          this.spriteStanding.w -
          (this.rightFacingHitboxes.sword.x + this.rightFacingHitboxes.sword.w),
      },
    };

    this.color = color;
    this.walkingSpeedMultiplier = walkingSpeedMultiplier;
    this.standingTimeBeforeAttackInMs = standingTimeBeforeAttackInMs;
    this.attackTimeInMs = attackTimeInMs;
    this.attackCooldownInMs = attackCooldownInMs;
  }

  getHitboxesOnScene(): Hitboxes {
    const hb =
      this.facing === ">" ? this.rightFacingHitboxes : this.leftFacingHitboxes;

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
      this.attackTimeLeft === undefined &&
      this.attackCooldownLeft === undefined
    ) {
      if (isFirstHitboxToTheLeft(playerHitbox, hitboxes.sword)) {
        this.facing = "<";
        this.x -= deltaTime * this.walkingSpeedMultiplier;
      } else if (isFirstHitboxToTheRight(playerHitbox, hitboxes.sword)) {
        this.facing = ">";
        this.x += deltaTime * this.walkingSpeedMultiplier;
      } else if (doHitboxesOverlap(playerHitbox, hitboxes.sword)) {
        this.attackCooldownLeft = this.attackCooldownInMs;
      }
    } else if (this.attackTimeLeft !== undefined) {
      this.attackTimeLeft -= deltaTime;
      if (this.attackTimeLeft <= 0) {
        this.attackTimeLeft = undefined;
      }
    } else if (this.attackCooldownLeft !== undefined) {
      this.attackCooldownLeft -= deltaTime;
      if (this.attackCooldownLeft <= 0) {
        this.attackCooldownLeft = undefined;

        if (doHitboxesOverlap(playerHitbox, hitboxes.sword)) {
          this.attackTimeLeft = this.attackTimeInMs;
          hitPlayer(this.dmg);
        }
      }
    }
  }

  getDrawData(): DrawCharacterParams {
    const sprite =
      this.attackTimeLeft !== undefined
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
}
