import { SpriteData } from "../assets/spriteSheetData";
import { DrawCharacterParams } from "../programs/CharacterProgram";
import { LeftRight } from "../types/LeftRight";
import { Terrain } from "./Terrain";

export abstract class Character {
  spriteStanding: SpriteData;
  spriteAttacking: SpriteData;

  x: number;
  y: number;
  _facing: LeftRight = "right";

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
  }

  abstract handleFrame(deltaTime: number, terrain: Terrain): void;
  abstract getDrawData(): DrawCharacterParams;
}
