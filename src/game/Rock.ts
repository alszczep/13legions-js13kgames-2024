import { SpriteData, spriteSheetData } from "../assets/spriteSheetData";
import { doHitboxesOverlap } from "../helpers/game/hitboxes";
import { DrawCharacterParams } from "../programs/CharacterProgram";
import {
  Dimensions,
  DimensionsAndCoordinates,
} from "../types/DimensionsAndCoordinates";

export class Rock {
  x: number;
  y: number;
  dmg: number;
  _fallingSpeed: number;
  _deleteSelf: () => void;

  _sprite: SpriteData;

  constructor(
    x: number,
    y: number,
    dmg: number,
    fallingSpeed: number,
    deleteSelf: () => void
  ) {
    this.x = x;
    this.y = y;
    this.dmg = dmg;
    this._fallingSpeed = fallingSpeed;
    this._deleteSelf = deleteSelf;

    this._sprite = spriteSheetData["r"];
  }

  getHitboxesOnScene(): DimensionsAndCoordinates {
    return {
      x: this.x,
      y: this.y - this._sprite.h,
      w: this._sprite.w,
      h: this._sprite.h,
    };
  }

  handleFrame(
    deltaTime: number,
    playerHitbox: DimensionsAndCoordinates,
    hitPlayer: (dmg: number) => void,
    canvasSize: Dimensions
  ) {
    this.y += this._fallingSpeed * deltaTime;

    if (this.y - this._sprite.h > canvasSize.h) {
      this._deleteSelf();
      return;
    }

    const hitboxes = this.getHitboxesOnScene();
    // its to easy to bump into the rock
    const adjustedHitboxes = {
      ...hitboxes,
      x: hitboxes.x + hitboxes.w * 0.05,
      y: hitboxes.y + hitboxes.h * 0.2,
      w: hitboxes.w * 0.9,
      h: hitboxes.h * 0.8,
    };
    if (doHitboxesOverlap(adjustedHitboxes, playerHitbox)) {
      hitPlayer(this.dmg);
      this._deleteSelf();
    }
  }

  getDrawData(): DrawCharacterParams {
    return {
      x: this.x,
      y: this.y - this._sprite.h,
      w: this._sprite.w,
      h: this._sprite.h,
      texCoords: this._sprite.texCoords,
      grayOffsetColor: [0, 0, 0],
    };
  }
}
