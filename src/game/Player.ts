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
  feet: DimensionsAndCoordinates;
};

export class Player extends Character {
  swordColor: BaseColors = "red";

  _isAttackButtonPressed: boolean = false;
  _attackTimeLeftInMs?: number = undefined;

  _isMoving: boolean = false;
  _movingTimeLeftInMs?: number = undefined;

  _isMovingVertically?: "up" | "down" = undefined;
  _jumpUpTimeLeftInMs?: number = undefined;

  _walkingSpeedMultiplier = 0.25;
  _attackTimeInMs = 200;
  _moveTimePerClickInMs = 25;
  _jumpUpTimeInMs = 225;
  _jumpSpeedMultiplier = 0.75;

  rightFacingHitboxes: Hitboxes = {
    character: {
      x: 10 * SPRITE_SIZE_MULTIPLIER,
      y: 0 * SPRITE_SIZE_MULTIPLIER,
      w: 11 * SPRITE_SIZE_MULTIPLIER,
      h: 16 * SPRITE_SIZE_MULTIPLIER,
    },
    sword: {
      x: 19 * SPRITE_SIZE_MULTIPLIER,
      y: 2 * SPRITE_SIZE_MULTIPLIER,
      w: 13 * SPRITE_SIZE_MULTIPLIER,
      h: 14 * SPRITE_SIZE_MULTIPLIER,
    },
    feet: {
      x: 13 * SPRITE_SIZE_MULTIPLIER,
      y: 14 * SPRITE_SIZE_MULTIPLIER,
      w: 8 * SPRITE_SIZE_MULTIPLIER,
      h: 2 * SPRITE_SIZE_MULTIPLIER,
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
      feet: {
        ...this.rightFacingHitboxes.feet,
        x:
          this.spriteStanding.w -
          (this.rightFacingHitboxes.feet.x + this.rightFacingHitboxes.feet.w),
      },
    };

    this._createEventListeners();
  }

  private _createEventListeners() {
    const move = (direction: "left" | "right") => {
      this._facing = direction;
      this._isMoving = true;
      this._movingTimeLeftInMs = this._moveTimePerClickInMs;
    };

    const attack = (color: BaseColors) => {
      if (this._attackTimeLeftInMs !== undefined || this._isAttackButtonPressed)
        return;

      this.swordColor = color;
      this._attackTimeLeftInMs = this._attackTimeInMs;
      this._isAttackButtonPressed = true;
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
        case " ":
        case "w":
          if (this._isMovingVertically) return;
          this._isMovingVertically = "up";
          this._jumpUpTimeLeftInMs = this._jumpUpTimeInMs;
      }
    });
    window.addEventListener("keyup", (e) => {
      switch (e.key) {
        case "d":
          if (this._isMoving && this._facing === "right") {
            this._isMoving = false;
          }
          break;
        case "a":
          if (this._isMoving && this._facing === "left") {
            this._isMoving = false;
          }
          break;
        case "j":
          if (this.swordColor === colorKeys.red) {
            this._isAttackButtonPressed = false;
          }
          break;
        case "k":
          if (this.swordColor === colorKeys.yellow) {
            this._isAttackButtonPressed = false;
          }
          break;
        case "l":
          if (this.swordColor === colorKeys.blue) {
            this._isAttackButtonPressed = false;
          }
          break;
      }
    });
  }

  getHitboxesOnScene(facing: LeftRight): Hitboxes {
    if (facing === "right") {
      return {
        character: {
          x: this.x + this.rightFacingHitboxes.character.x,
          y:
            this.y -
            this.spriteAttacking.h +
            this.rightFacingHitboxes.character.y,
          w: this.rightFacingHitboxes.character.w,
          h: this.rightFacingHitboxes.character.h,
        },
        sword: {
          x: this.x + this.rightFacingHitboxes.sword.x,
          y: this.y - this.spriteAttacking.h + this.rightFacingHitboxes.sword.y,
          w: this.rightFacingHitboxes.sword.w,
          h: this.rightFacingHitboxes.sword.h,
        },
        feet: {
          x: this.x + this.rightFacingHitboxes.feet.x,
          y: this.y - this.spriteAttacking.h + this.rightFacingHitboxes.feet.y,
          w: this.rightFacingHitboxes.feet.w,
          h: this.rightFacingHitboxes.feet.h,
        },
      };
    }

    return {
      character: {
        x: this.x + this.leftFacingHitboxes.character.x,
        y:
          this.y - this.spriteAttacking.h + this.leftFacingHitboxes.character.y,
        w: this.leftFacingHitboxes.character.w,
        h: this.leftFacingHitboxes.character.h,
      },
      sword: {
        x: this.x + this.leftFacingHitboxes.sword.x,
        y: this.y - this.spriteAttacking.h + this.leftFacingHitboxes.sword.y,
        w: this.leftFacingHitboxes.sword.w,
        h: this.leftFacingHitboxes.sword.h,
      },
      feet: {
        x: this.x + this.leftFacingHitboxes.feet.x,
        y: this.y - this.spriteAttacking.h + this.leftFacingHitboxes.feet.y,
        w: this.leftFacingHitboxes.feet.w,
        h: this.leftFacingHitboxes.feet.h,
      },
    };
  }

  handleFrame(deltaTime: number, terrain: Terrain): void {
    const hitboxes = this.getHitboxesOnScene(this._facing);

    if (this._isMovingVertically) {
      const moveDistance = deltaTime * this._jumpSpeedMultiplier;
      if (this._isMovingVertically === "up") {
        this.y -= moveDistance;
      }
      if (this._isMovingVertically === "down") {
        const groundInReach = terrain.groundRectangles.find((r) => {
          const horizontal =
            r.x < hitboxes.feet.x + hitboxes.feet.w &&
            r.x + r.w > hitboxes.feet.x;
          const vertical =
            hitboxes.feet.y + hitboxes.feet.h < r.y &&
            hitboxes.feet.y + hitboxes.feet.h + moveDistance >= r.y;

          return horizontal && vertical;
        });

        if (groundInReach) {
          this.y = groundInReach.y;
          this._isMovingVertically = undefined;
        } else {
          this.y += moveDistance;
        }
      }

      if (this._jumpUpTimeLeftInMs !== undefined) {
        if (this._jumpUpTimeLeftInMs <= 0) {
          this._isMovingVertically = "down";
          this._jumpUpTimeLeftInMs = undefined;
        } else {
          this._jumpUpTimeLeftInMs -= deltaTime;
        }
      }
    }

    if (this._movingTimeLeftInMs !== undefined) {
      const moveDistance = deltaTime * this._walkingSpeedMultiplier;
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

      if (this._isMovingVertically === undefined) {
        const updatedHitboxes = this.getHitboxesOnScene(this._facing);
        const groundInReach = terrain.groundRectangles.find((r) => {
          const horizontal =
            r.x < updatedHitboxes.feet.x + updatedHitboxes.feet.w &&
            r.x + r.w > updatedHitboxes.feet.x;
          const vertical =
            updatedHitboxes.feet.y + updatedHitboxes.feet.h === r.y;

          return horizontal && vertical;
        });

        if (!groundInReach) {
          this._isMovingVertically = "down";
        }
      }

      this._movingTimeLeftInMs -= deltaTime;

      if (this._movingTimeLeftInMs <= 0) {
        if (this._isMoving) {
          this._movingTimeLeftInMs = this._moveTimePerClickInMs;
        } else {
          this._movingTimeLeftInMs = undefined;
        }
      }
    }

    if (this._attackTimeLeftInMs !== undefined) {
      this._attackTimeLeftInMs -= deltaTime;

      if (this._attackTimeLeftInMs <= 0) {
        this._attackTimeLeftInMs = undefined;
      }
    }
  }

  getDrawData(): DrawCharacterParams {
    const sprite =
      this._attackTimeLeftInMs !== undefined
        ? this.spriteAttacking
        : this.spriteStanding;

    return {
      x: this.x,
      y: this.y - this.spriteStanding.h,
      w: sprite.w,
      h: sprite.h,
      texCoords: sprite.texCoords,
      grayOffsetColor: colorVectors[this.swordColor],
      flipX: this._facing === "left",
    };
  }
}
