import { spriteSheetData } from "../assets/spriteSheetData";
import { BaseColors, colorKeys, colorVectors } from "../colors";
import { SPRITE_SIZE_MULTIPLIER } from "../consts";
import { doHitboxesOverlap } from "../helpers/game/hitboxes";
import { DrawCharacterParams } from "../programs/CharacterProgram";
import { playSound, SoundEffect } from "../sound/playSound";
import {
  Dimensions,
  DimensionsAndCoordinates,
} from "../types/DimensionsAndCoordinates";
import { flipLeftRight, LeftRight, UpDown } from "../types/Directions";
import { Character } from "./Character";
import { Terrain } from "./Terrain";
import { updateHpBar } from "./ui/setupHpBar";

type Hitboxes = {
  body: DimensionsAndCoordinates;
  sword: DimensionsAndCoordinates;
  feet: DimensionsAndCoordinates;
};

export class Player extends Character {
  onGameOver?: () => void;

  _swordColor: BaseColors;

  _isAttackButtonPressed: boolean;
  _attackTimeLeftInMs?: number;

  _isMoving: boolean;
  _movingTimeLeftInMs?: number;

  _isMovingVertically?: UpDown;
  _jumpUpTimeLeftInMs?: number;

  _walkingSpeedMultiplier;
  _attackTimeInMs;
  _moveTimePerClickInMs;
  _jumpUpTimeInMs;
  _jumpSpeedMultiplier;

  _rightFacingHitboxes: Hitboxes;
  _leftFacingHitboxes: Hitboxes;

  constructor(x: number, y: number) {
    super(
      spriteSheetData["character-2 0.aseprite"],
      spriteSheetData["character-2 1.aseprite"],
      x,
      y,
      1000,
      50
    );

    this._swordColor = colorKeys.r;

    this._isAttackButtonPressed = false;
    this._isMoving = false;

    this._walkingSpeedMultiplier = 0.25;
    this._attackTimeInMs = 200;
    this._moveTimePerClickInMs = 25;
    this._jumpUpTimeInMs = 225;
    this._jumpSpeedMultiplier = 0.75;

    updateHpBar(this._currentHp, this._maxHp);

    this._rightFacingHitboxes = {
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
    const move = (direction: LeftRight) => {
      this.facing = direction;
      this._isMoving = true;
      this._movingTimeLeftInMs = this._moveTimePerClickInMs;
    };

    const attack = (color: BaseColors) => {
      if (this._attackTimeLeftInMs !== undefined || this._isAttackButtonPressed)
        return;

      this._swordColor = color;
      this._attackTimeLeftInMs = this._attackTimeInMs;
      this._isAttackButtonPressed = true;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "d":
        case "ArrowRight":
          move(">");
          break;
        case "a":
        case "ArrowLeft":
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
        case "ArrowUp":
          if (this._isMovingVertically) return;
          this._isMovingVertically = "^";
          this._jumpUpTimeLeftInMs = this._jumpUpTimeInMs;
          playSound(SoundEffect.Jump);
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case "d":
        case "ArrowRight":
          if (this._isMoving && this.facing === ">") {
            this._isMoving = false;
          }
          break;
        case "a":
        case "ArrowLeft":
          if (this._isMoving && this.facing === "<") {
            this._isMoving = false;
          }
          break;
        case "j":
          if (this._swordColor === colorKeys.r) {
            this._isAttackButtonPressed = false;
          }
          break;
        case "k":
          if (this._swordColor === colorKeys.y) {
            this._isAttackButtonPressed = false;
          }
          break;
        case "l":
          if (this._swordColor === colorKeys.b) {
            this._isAttackButtonPressed = false;
          }
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    this.onGameOver = () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }

  getHitboxesOnScene(): Hitboxes {
    const hb =
      this.facing === ">"
        ? this._rightFacingHitboxes
        : this._leftFacingHitboxes;

    const mkHitbox = (hb: DimensionsAndCoordinates) => ({
      ...hb,
      x: this.x + hb.x,
      y: this.y - this.spriteStanding.h + hb.y,
    });

    return {
      body: mkHitbox(hb.body),
      sword: mkHitbox(hb.sword),
      feet: mkHitbox(hb.feet),
    };
  }

  _handleFrameJump(deltaTime: number, terrain: Terrain) {
    const hitboxes = this.getHitboxesOnScene();

    if (this._isMovingVertically) {
      const moveDistance = deltaTime * this._jumpSpeedMultiplier;
      if (this._isMovingVertically === "^") {
        this.y -= moveDistance;
      } else if (this._isMovingVertically === "v") {
        const groundInReach = terrain._groundRectangles.find((r) => {
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
          this._isMovingVertically = "v";
          this._jumpUpTimeLeftInMs = undefined;
        } else {
          this._jumpUpTimeLeftInMs -= deltaTime;
        }
      }
    }
  }

  _handleFrameMovement(deltaTime: number, canvasSize: Dimensions) {
    const hitboxes = this.getHitboxesOnScene();

    if (this._movingTimeLeftInMs !== undefined) {
      const moveDistance = deltaTime * this._walkingSpeedMultiplier;
      if (
        this.facing === ">" &&
        hitboxes.body.x + hitboxes.body.w < canvasSize.w
      ) {
        this.x += moveDistance;
      }
      if (this.facing === "<" && hitboxes.body.x > 0) {
        this.x -= moveDistance;
      }

      this._movingTimeLeftInMs -= deltaTime;

      if (this._movingTimeLeftInMs <= 0) {
        this._movingTimeLeftInMs = this._isMoving
          ? this._moveTimePerClickInMs
          : undefined;
      }
    }
  }

  _handleFrameFalling(terrain: Terrain) {
    const hitboxes = this.getHitboxesOnScene();

    if (this._isMovingVertically === undefined) {
      const groundInReach = terrain._groundRectangles.find((r) => {
        const horizontal =
          r.x < hitboxes.feet.x + hitboxes.feet.w &&
          r.x + r.w > hitboxes.feet.x;
        const vertical = hitboxes.feet.y + hitboxes.feet.h === r.y;

        return horizontal && vertical;
      });

      if (!groundInReach) {
        this._isMovingVertically = "v";
      }
    }
  }

  _handleFrameAttack(
    deltaTime: number,
    enemies: {
      hitbox: DimensionsAndCoordinates;
      hit: (dmg: number, from: LeftRight) => void;
      color: BaseColors;
    }[]
  ) {
    const hitboxes = this.getHitboxesOnScene();

    if (this._attackTimeLeftInMs !== undefined) {
      if (this._attackTimeLeftInMs === this._attackTimeInMs) {
        let enemyHit = false;

        enemies.forEach((e) => {
          if (
            doHitboxesOverlap(hitboxes.sword, e.hitbox) &&
            this._swordColor === e.color
          ) {
            e.hit(this.dmg, flipLeftRight(this.facing));
            enemyHit = true;
          }
        });

        playSound(
          enemyHit ? SoundEffect.PlayerAttackHit : SoundEffect.PlayerAttack
        );
      }

      this._attackTimeLeftInMs -= deltaTime;

      if (this._attackTimeLeftInMs <= 0) {
        this._attackTimeLeftInMs = undefined;
      }
    }
  }

  handleFrame(
    deltaTime: number,
    terrain: Terrain,
    enemies: {
      hitbox: DimensionsAndCoordinates;
      hit: (dmg: number, from: LeftRight) => void;
      color: BaseColors;
    }[],
    canvasSize: Dimensions
  ) {
    this._handleFrameJump(deltaTime, terrain);
    this._handleFrameMovement(deltaTime, canvasSize);
    this._handleFrameFalling(terrain);
    this._handleFrameAttack(deltaTime, enemies);
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
      grayOffsetColor: colorVectors[this._swordColor],
      flipX: this.facing === "<",
    };
  }

  getHit(dmg: number, from: LeftRight) {
    super.getHit(dmg, from);
    updateHpBar(this._currentHp, this._maxHp);
    playSound(SoundEffect.PlayerGotHit);
  }
}
