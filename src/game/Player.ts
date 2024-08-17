import { spriteSheetData } from "../assets/spriteSheetData";
import { BaseColors, colorKeys, colorVectors } from "../colors";
import { SPRITE_SIZE_MULTIPLIER } from "../consts";
import { DrawCharacterParams } from "../programs/CharacterProgram";
import { DimensionsAndCoordinates } from "../types/DimensionsAndCoordinates";
import { LeftRight } from "../types/LeftRight";
import { Character } from "./Character";
import { Terrain } from "./Terrain";

type Hitboxes = {
  character: DimensionsAndCoordinates;
  sword: DimensionsAndCoordinates;
};

export class Player extends Character {
  swordColor: BaseColors = "red";
  isAttackButtonPressed: boolean = false;
  attackTimeLeft?: number = undefined;
  isMoving: boolean = false;
  movingTimeLeft?: number = undefined;

  walkingSpeedMultiplier = 0.25;
  attackTimeInMs = 200;
  moveTimePerClickInMs = 25;

  rightFacingHitboxes: Hitboxes = {
    character: {
      x: 10,
      y: 0,
      w: 11,
      h: 16,
    },
    sword: {
      x: 19,
      y: 2,
      w: 13,
      h: 14,
    },
  };
  leftFacingHitboxes: Hitboxes = {} as Hitboxes;

  constructor(x: number, y: number) {
    super(
      spriteSheetData["character-2 0.aseprite"],
      spriteSheetData["character-2 1.aseprite"],
      x,
      y
    );

    this.leftFacingHitboxes = {
      character: {
        ...this.rightFacingHitboxes.character,
        x:
          this.spriteStanding.w -
          (this.rightFacingHitboxes.character.x +
            this.rightFacingHitboxes.character.w),
      },
      sword: {
        ...this.rightFacingHitboxes.sword,
        x:
          this.spriteStanding.w -
          (this.rightFacingHitboxes.sword.x + this.rightFacingHitboxes.sword.w),
      },
    };

    this._createEventListeners();
  }

  private _createEventListeners() {
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

  getHitboxesOnScene(facing: LeftRight) {
    if (facing === "right") {
      return {
        character: {
          x:
            this.x +
            this.rightFacingHitboxes.character.x * SPRITE_SIZE_MULTIPLIER,
          y:
            this.y -
            this.yDrawOffset +
            this.rightFacingHitboxes.character.y * SPRITE_SIZE_MULTIPLIER,
          w: this.rightFacingHitboxes.character.w * SPRITE_SIZE_MULTIPLIER,
          h: this.rightFacingHitboxes.character.h * SPRITE_SIZE_MULTIPLIER,
        },
        sword: {
          x: this.x + this.rightFacingHitboxes.sword.x * SPRITE_SIZE_MULTIPLIER,
          y:
            this.y -
            this.yDrawOffset +
            this.rightFacingHitboxes.sword.y * SPRITE_SIZE_MULTIPLIER,
          w: this.rightFacingHitboxes.sword.w * SPRITE_SIZE_MULTIPLIER,
          h: this.rightFacingHitboxes.sword.h * SPRITE_SIZE_MULTIPLIER,
        },
      };
    }

    return {
      character: {
        x:
          this.x + this.leftFacingHitboxes.character.x * SPRITE_SIZE_MULTIPLIER,
        y:
          this.y -
          this.yDrawOffset +
          this.leftFacingHitboxes.character.y * SPRITE_SIZE_MULTIPLIER,
        w: this.leftFacingHitboxes.character.w * SPRITE_SIZE_MULTIPLIER,
        h: this.leftFacingHitboxes.character.h * SPRITE_SIZE_MULTIPLIER,
      },
      sword: {
        x: this.x + this.leftFacingHitboxes.sword.x * SPRITE_SIZE_MULTIPLIER,
        y:
          this.y -
          this.yDrawOffset +
          this.leftFacingHitboxes.sword.y * SPRITE_SIZE_MULTIPLIER,
        w: this.leftFacingHitboxes.sword.w * SPRITE_SIZE_MULTIPLIER,
        h: this.leftFacingHitboxes.sword.h * SPRITE_SIZE_MULTIPLIER,
      },
    };
  }

  handleFrame(deltaTime: number, terrain: Terrain): void {
    const hitboxes = this.getHitboxesOnScene(this._facing);

    if (
      this.movingTimeLeft !== undefined &&
      this.attackTimeLeft === undefined
    ) {
      const moveDistance = deltaTime * this.walkingSpeedMultiplier;
      if (
        this._facing === "right" &&
        hitboxes.character.x + hitboxes.character.w < terrain.skyRectangle.w
      ) {
        this.x += moveDistance;
      }
      if (
        this._facing === "left" &&
        hitboxes.character.x > terrain.skyRectangle.x
      ) {
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
