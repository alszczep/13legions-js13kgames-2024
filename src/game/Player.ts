import { spriteSheetData } from "../assets/spriteSheetData";
import { BaseColors, colorKeys, colorVectors } from "../colors";
import { SPRITE_SIZE_MULTIPLIER } from "../consts";
import { doHitboxesOverlap } from "../helpers/game/hitboxes";
import { DrawCharacterParams } from "../programs/CharacterProgram";
import { DimensionsAndCoordinates } from "../types/DimensionsAndCoordinates";
import { Character } from "./Character";
import { Terrain } from "./Terrain";

type Hitboxes = {
  body: DimensionsAndCoordinates;
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

  _rightFacingHitboxes: Hitboxes = {
    body: {
      x: 11 * SPRITE_SIZE_MULTIPLIER,
      y: 0 * SPRITE_SIZE_MULTIPLIER,
      w: 10 * SPRITE_SIZE_MULTIPLIER,
      h: 16 * SPRITE_SIZE_MULTIPLIER,
    },
    sword: {
      x: 15 * SPRITE_SIZE_MULTIPLIER,
      y: 2 * SPRITE_SIZE_MULTIPLIER,
      w: 17 * SPRITE_SIZE_MULTIPLIER,
      h: 14 * SPRITE_SIZE_MULTIPLIER,
    },
    feet: {
      x: 13 * SPRITE_SIZE_MULTIPLIER,
      y: 14 * SPRITE_SIZE_MULTIPLIER,
      w: 8 * SPRITE_SIZE_MULTIPLIER,
      h: 2 * SPRITE_SIZE_MULTIPLIER,
    },
  };
  _leftFacingHitboxes: Hitboxes = {} as Hitboxes;

  constructor(x: number, y: number) {
    super(
      spriteSheetData["character-2 0.aseprite"],
      spriteSheetData["character-2 1.aseprite"],
      x,
      y,
      1000,
      50
    );

    this._leftFacingHitboxes = {
      body: {
        ...this._rightFacingHitboxes.body,
        x:
          this.spriteStanding.w -
          (this._rightFacingHitboxes.body.x + this._rightFacingHitboxes.body.w),
      },
      sword: {
        ...this._rightFacingHitboxes.sword,
        x:
          this.spriteStanding.w -
          (this._rightFacingHitboxes.sword.x +
            this._rightFacingHitboxes.sword.w),
      },
      feet: {
        ...this._rightFacingHitboxes.feet,
        x:
          this.spriteStanding.w -
          (this._rightFacingHitboxes.feet.x + this._rightFacingHitboxes.feet.w),
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

  getHitboxesOnScene(): Hitboxes {
    const hb =
      this._facing === "right"
        ? this._rightFacingHitboxes
        : this._leftFacingHitboxes;

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
      feet: {
        ...hb.feet,
        x: this.x + hb.feet.x,
        y: this.y - this.spriteStanding.h + hb.feet.y,
      },
    };
  }

  handleFrame(
    deltaTime: number,
    terrain: Terrain,
    enemies: {
      hitbox: DimensionsAndCoordinates;
      hit: (dmg: number) => void;
      color: BaseColors;
    }[]
  ): void {
    const hitboxes = this.getHitboxesOnScene();

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
        hitboxes.body.x + hitboxes.body.w < terrain.skyRectangle.w
      ) {
        this.x += moveDistance;
      }
      if (this._facing === "left" && hitboxes.body.x > terrain.skyRectangle.x) {
        this.x -= moveDistance;
      }

      if (this._isMovingVertically === undefined) {
        const updatedHitboxes = this.getHitboxesOnScene();
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
      if (this._attackTimeLeftInMs === this._attackTimeInMs) {
        enemies.forEach((e) => {
          if (
            doHitboxesOverlap(hitboxes.sword, e.hitbox) &&
            this.swordColor === e.color
          ) {
            e.hit(this.dmg);
          }
        });
      }

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
      y: this.y - sprite.h,
      w: sprite.w,
      h: sprite.h,
      texCoords: sprite.texCoords,
      grayOffsetColor: colorVectors[this.swordColor],
      flipX: this._facing === "left",
    };
  }
}
