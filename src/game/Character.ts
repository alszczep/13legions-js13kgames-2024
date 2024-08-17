import { SpriteData } from "../assets/spriteSheetData";
import { SPRITE_SIZE_MULTIPLIER } from "../consts";
import { DrawCharacterParams } from "../programs/CharacterProgram";

export abstract class Character {
  spriteStanding: SpriteData;
  spriteAttacking: SpriteData;

  x: number;
  y: number;
  _facing: "left" | "right" = "right";

  yDrawOffset: number;

  constructor(
    spriteStanding: SpriteData,
    spriteAttacking: SpriteData,
    x: number,
    y: number
  ) {
    this.spriteStanding = spriteStanding;
    this.spriteAttacking = spriteAttacking;
    this.x = x;
    this.y = y;
    this.yDrawOffset = spriteStanding.h * SPRITE_SIZE_MULTIPLIER;
  }

  abstract handleFrame(deltaTime: number): void;
  abstract getDrawData(): DrawCharacterParams;
}
