import { SpriteData } from "../assets/spriteSheetData";
import { BaseColors, colorVectors } from "../colors";
import { DrawCharacterParams } from "../programs/CharacterProgram";
import { Character } from "./Character";

export class Enemy extends Character {
  color: BaseColors;
  attackTimeLeft?: number = undefined;
  isMoving: boolean = false;

  walkingSpeedMultiplier: number;
  standingTimeBeforeAttackInMs: number;
  attackTimeInMs: number;

  constructor(
    spriteStanding: SpriteData,
    spriteAttacking: SpriteData,
    x: number,
    y: number,
    color: BaseColors,
    walkingSpeedMultiplier: number,
    standingTimeBeforeAttackInMs: number,
    attackTimeInMs: number
  ) {
    super(spriteStanding, spriteAttacking, x, y);

    this.color = color;
    this.walkingSpeedMultiplier = walkingSpeedMultiplier;
    this.standingTimeBeforeAttackInMs = standingTimeBeforeAttackInMs;
    this.attackTimeInMs = attackTimeInMs;
  }

  handleFrame(deltaTime: number): void {}

  getDrawData(): DrawCharacterParams {
    const sprite =
      this.attackTimeLeft !== undefined
        ? this.spriteAttacking
        : this.spriteStanding;

    return {
      x: this.x,
      y: this.y,
      w: this.spriteStanding.w,
      h: this.spriteStanding.h,
      texCoords: sprite.texCoords,
      grayOffsetColor: colorVectors[this.color],
      flipX: this._facing === "left",
    };
  }
}
