import { SpriteData } from "../assets/spriteSheetData";
import { DrawCharacterParams } from "../programs/CharacterProgram";
import { LeftRight } from "../types/Directions";

export abstract class Character {
  spriteStanding: SpriteData;
  spriteAttacking: SpriteData;

  x: number;
  y: number;
  facing: LeftRight;

  _currentHp: number;
  _maxHp: number;
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
    this._currentHp = maxHp;
    this._maxHp = maxHp;
    this.dmg = dmg;

    this.facing = ">";
  }

  getHit(dmg: number, _from: LeftRight) {
    if (this._currentHp > 0) {
      this._currentHp -= dmg;
    }
  }

  abstract getDrawData(): DrawCharacterParams;
}
