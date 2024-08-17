import { spriteSheetData } from "../assets/spriteSheetData";
import { BaseColors, colorKeys, colorVectors } from "../colors";
import { DrawCharacterParams } from "../programs/CharacterProgram";
import { Character } from "./Character";

export class Player extends Character {
  swordColor: BaseColors = "red";
  isAttackButtonPressed: boolean = false;
  attackTimeLeft?: number = undefined;
  isMoving: boolean = false;
  movingTimeLeft?: number = undefined;

  walkingSpeedMultiplier = 0.25;
  attackTimeInMs = 200;
  moveTimePerClickInMs = 25;

  constructor(x: number, y: number) {
    super(
      spriteSheetData["character-2 0.aseprite"],
      spriteSheetData["character-2 1.aseprite"],
      x,
      y
    );

    this.createEventListeners();
  }

  private createEventListeners() {
    const move = (direction: "left" | "right") => {
      this._facing = direction;
      this.isMoving = true;
      this.movingTimeLeft = this.moveTimePerClickInMs;
    };

    const attack = (color: BaseColors) => {
      if (this.attackTimeLeft !== undefined || this.isAttackButtonPressed)
        return;

      this.swordColor = color;
      this.attackTimeLeft = this.attackTimeInMs;
      this.isAttackButtonPressed = true;
    };

    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "d":
          move("right");
          break;
        case "a":
          move("left");
          break;
        case "j":
          attack("red");
          break;
        case "k":
          attack("yellow");
          break;
        case "l":
          attack("blue");
          break;
      }
    });
    window.addEventListener("keyup", (e) => {
      switch (e.key) {
        case "d":
          if (this.isMoving && this._facing === "right") {
            this.isMoving = false;
          }
          break;
        case "a":
          if (this.isMoving && this._facing === "left") {
            this.isMoving = false;
          }
          break;
        case "j":
          if (this.swordColor === colorKeys.red) {
            this.isAttackButtonPressed = false;
          }
          break;
        case "k":
          if (this.swordColor === colorKeys.yellow) {
            this.isAttackButtonPressed = false;
          }
          break;
        case "l":
          if (this.swordColor === colorKeys.blue) {
            this.isAttackButtonPressed = false;
          }
          break;
      }
    });
  }

  handleFrame(deltaTime: number): void {
    if (this.movingTimeLeft !== undefined) {
      const moveDistance = deltaTime * this.walkingSpeedMultiplier;
      if (this._facing === "right") {
        this.x += moveDistance;
      } else {
        this.x -= moveDistance;
      }

      this.movingTimeLeft -= deltaTime;

      if (this.movingTimeLeft <= 0) {
        if (this.isMoving) {
          this.movingTimeLeft = this.moveTimePerClickInMs;
        } else {
          this.movingTimeLeft = undefined;
        }
      }
    }

    if (this.attackTimeLeft !== undefined) {
      this.attackTimeLeft -= deltaTime;

      if (this.attackTimeLeft <= 0) {
        this.attackTimeLeft = undefined;
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
      y: this.y - this.yDrawOffset,
      w: sprite.w,
      h: sprite.h,
      texCoords: sprite.texCoords,
      grayOffsetColor: colorVectors[this.swordColor],
      flipX: this._facing === "left",
    };
  }
}
