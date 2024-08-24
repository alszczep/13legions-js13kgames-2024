import { SpriteData } from "../assets/spriteSheetData";
import { DrawCharacterParams } from "../programs/CharacterProgram";
import { LeftRight } from "../types/Directions";

export abstract class Character {
  spriteStanding: SpriteData;
  spriteAttacking: SpriteData;

  x: number;
  y: number;
  facing: LeftRight;

  currentHp: number;
  maxHp: number;
  dmg: number;

  constructor(
    spriteStanding: SpriteData,
    spriteAttacking: SpriteData,
    x: number,
    y: number,
    maxHp: number,
    dmg: number
  ) {
    this.spriteStanding = spriteStanding;
    this.spriteAttacking = spriteAttacking;
    this.x = x;
    this.y = y;
    this.currentHp = maxHp;
    this.maxHp = maxHp;
    this.dmg = dmg;

    this.facing = ">";
  }

  getHit(dmg: number) {
    if (this.currentHp > 0) {
      this.currentHp -= dmg;
    }
  }

  abstract getDrawData(): DrawCharacterParams;
}
