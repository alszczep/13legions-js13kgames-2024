import { spriteSheetData } from "../assets/spriteSheetData";
import { BaseColors, colorKeys, colorVectors } from "../colors";
import { SPRITE_SIZE_MULTIPLIER } from "../consts";
import { doHitboxesOverlap } from "../helpers/game/hitboxes";
import { DrawCharacterParams } from "../programs/CharacterProgram";
import {
  Dimensions,
  DimensionsAndCoordinates,
} from "../types/DimensionsAndCoordinates";
import { LeftRight, UpDown } from "../types/Directions";
import { Character } from "./Character";
import { Terrain } from "./Terrain";

type Hitboxes = {
  body: DimensionsAndCoordinates;
  sword: DimensionsAndCoordinates;
  feet: DimensionsAndCoordinates;
};

export class Player extends Character {
  swordColor: BaseColors = colorKeys.r;

  isAttackButtonPressed: boolean = false;
  attackTimeLeftInMs?: number = undefined;

  isMoving: boolean = false;
  movingTimeLeftInMs?: number = undefined;

  isMovingVertically?: UpDown = undefined;
  jumpUpTimeLeftInMs?: number = undefined;

  walkingSpeedMultiplier = 0.25;
  attackTimeInMs = 200;
  moveTimePerClickInMs = 25;
  jumpUpTimeInMs = 225;
  jumpSpeedMultiplier = 0.75;

  rightFacingHitboxes: Hitboxes = {
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
  leftFacingHitboxes: Hitboxes = {} as Hitboxes;

  constructor(x: number, y: number) {
    super(
      spriteSheetData["character-2 0.aseprite"],
      spriteSheetData["character-2 1.aseprite"],
      x,
      y,
      1000,
      50
    );

    this.leftFacingHitboxes = {
      body: {
        ...this.rightFacingHitboxes.body,
        x:
          this.spriteStanding.w -
          (this.rightFacingHitboxes.body.x + this.rightFacingHitboxes.body.w),
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
    const move = (direction: LeftRight) => {
      this.facing = direction;
      this.isMoving = true;
      this.movingTimeLeftInMs = this.moveTimePerClickInMs;
    };

    const attack = (color: BaseColors) => {
      if (this.attackTimeLeftInMs !== undefined || this.isAttackButtonPressed)
        return;

      this.swordColor = color;
      this.attackTimeLeftInMs = this.attackTimeInMs;
      this.isAttackButtonPressed = true;
    };

    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "d":
          move(">");
          break;
        case "a":
          move("<");
          break;
        case "j":
          attack(colorKeys.r);
          break;
        case "k":
          attack(colorKeys.y);
          break;
        case "l":
          attack(colorKeys.b);
          break;
        case " ":
        case "w":
          if (this.isMovingVertically) return;
          this.isMovingVertically = "^";
          this.jumpUpTimeLeftInMs = this.jumpUpTimeInMs;
      }
    });
    window.addEventListener("keyup", (e) => {
      switch (e.key) {
        case "d":
          if (this.isMoving && this.facing === ">") {
            this.isMoving = false;
          }
          break;
        case "a":
          if (this.isMoving && this.facing === "<") {
            this.isMoving = false;
          }
          break;
        case "j":
          if (this.swordColor === colorKeys.r) {
            this.isAttackButtonPressed = false;
          }
          break;
        case "k":
          if (this.swordColor === colorKeys.y) {
            this.isAttackButtonPressed = false;
          }
          break;
        case "l":
          if (this.swordColor === colorKeys.b) {
            this.isAttackButtonPressed = false;
          }
          break;
      }
    });
  }

  getHitboxesOnScene(): Hitboxes {
    const hb =
      this.facing === ">" ? this.rightFacingHitboxes : this.leftFacingHitboxes;

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
    }[],
    canvasSize: Dimensions
  ): void {
    const hitboxes = this.getHitboxesOnScene();

    if (this.isMovingVertically) {
      const moveDistance = deltaTime * this.jumpSpeedMultiplier;
      if (this.isMovingVertically === "^") {
        this.y -= moveDistance;
      }
      if (this.isMovingVertically === "v") {
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
          this.isMovingVertically = undefined;
        } else {
          this.y += moveDistance;
        }
      }

      if (this.jumpUpTimeLeftInMs !== undefined) {
        if (this.jumpUpTimeLeftInMs <= 0) {
          this.isMovingVertically = "v";
          this.jumpUpTimeLeftInMs = undefined;
        } else {
          this.jumpUpTimeLeftInMs -= deltaTime;
        }
      }
    }

    if (this.movingTimeLeftInMs !== undefined) {
      const moveDistance = deltaTime * this.walkingSpeedMultiplier;
      if (
        this.facing === ">" &&
        hitboxes.body.x + hitboxes.body.w < canvasSize.w
      ) {
        this.x += moveDistance;
      }
      if (this.facing === "<" && hitboxes.body.x > 0) {
        this.x -= moveDistance;
      }

      if (this.isMovingVertically === undefined) {
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
          this.isMovingVertically = "v";
        }
      }

      this.movingTimeLeftInMs -= deltaTime;

      if (this.movingTimeLeftInMs <= 0) {
        if (this.isMoving) {
          this.movingTimeLeftInMs = this.moveTimePerClickInMs;
        } else {
          this.movingTimeLeftInMs = undefined;
        }
      }
    }

    if (this.attackTimeLeftInMs !== undefined) {
      if (this.attackTimeLeftInMs === this.attackTimeInMs) {
        enemies.forEach((e) => {
          if (
            doHitboxesOverlap(hitboxes.sword, e.hitbox) &&
            this.swordColor === e.color
          ) {
            e.hit(this.dmg);
          }
        });
      }

      this.attackTimeLeftInMs -= deltaTime;

      if (this.attackTimeLeftInMs <= 0) {
        this.attackTimeLeftInMs = undefined;
      }
    }
  }

  getDrawData(): DrawCharacterParams {
    const sprite =
      this.attackTimeLeftInMs !== undefined
        ? this.spriteAttacking
        : this.spriteStanding;

    return {
      x: this.x,
      y: this.y - sprite.h,
      w: sprite.w,
      h: sprite.h,
      texCoords: sprite.texCoords,
      grayOffsetColor: colorVectors[this.swordColor],
      flipX: this.facing === "<",
    };
  }
}
