import { loadSpriteSheet } from "./assets/loadSpriteSheet";
import { getGl } from "./helpers/rendering/getGl";
import { glCreateTexture } from "./helpers/rendering/gl/glCreateTexture";
import { spriteSheetData } from "./assets/spriteSheetData";
import { colorKeys, colorVectors } from "./colors";
import { TerrainProgram } from "./programs/TerrainProgram";
import { CharacterProgram } from "./programs/CharacterProgram";
import { SPRITE_SIZE_MULTIPLIER } from "./consts";

async function main() {
  const spriteSheet = await loadSpriteSheet();

  const gl = getGl();

  const terrainProgram = new TerrainProgram(gl);
  const characterProgram = new CharacterProgram(gl);

  const spriteSheetTexture = glCreateTexture(gl, spriteSheet);

  terrainProgram.bindVao();
  terrainProgram.useProgram();
  gl.uniform2f(
    terrainProgram.uniformsLocations.u_resolution,
    gl.canvas.width,
    gl.canvas.height
  );

  characterProgram.bindVao();
  characterProgram.useProgram();
  gl.uniform2f(
    characterProgram.uniformsLocations.u_resolution,
    gl.canvas.width,
    gl.canvas.height
  );
  gl.uniform1i(
    characterProgram.uniformsLocations.u_image,
    spriteSheetTexture.id
  );

  const texCoordsCharacterStanding =
    spriteSheetData["character-2 0.aseprite"].texCoords;
  const texCoordsCharacterAttacking =
    spriteSheetData["character-2 1.aseprite"].texCoords;

  const characterData: {
    x: number;
    y: number;
    facing: "left" | "right";
    swordColor: keyof typeof colorKeys;
    attackingTime?: number;
    isAttackButtonPressed: boolean;
    isMoving: boolean;
    movingTimeLeft?: number;
  } = {
    x: 0,
    y: 0,
    facing: "right",
    swordColor: colorKeys.red as keyof typeof colorKeys,
    attackingTime: undefined,
    isAttackButtonPressed: false,
    isMoving: false,
    movingTimeLeft: undefined,
  };

  const move = (direction: "left" | "right") => {
    characterData.facing = direction;
    characterData.isMoving = true;
    characterData.movingTimeLeft = 25;
  };

  const attack = (
    color:
      | typeof colorKeys.red
      | typeof colorKeys.yellow
      | typeof colorKeys.blue
  ) => {
    if (characterData.attackingTime || characterData.isAttackButtonPressed)
      return;

    characterData.swordColor = color;
    characterData.attackingTime = 200;
    characterData.isAttackButtonPressed = true;
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
        if (characterData.isMoving && characterData.facing === "right") {
          characterData.isMoving = false;
        }
        break;
      case "a":
        if (characterData.isMoving && characterData.facing === "left") {
          characterData.isMoving = false;
        }
        break;
      case "j":
        if (characterData.swordColor === colorKeys.red) {
          characterData.isAttackButtonPressed = false;
        }
        break;
      case "k":
        if (characterData.swordColor === colorKeys.yellow) {
          characterData.isAttackButtonPressed = false;
        }
        break;
      case "l":
        if (characterData.swordColor === colorKeys.blue) {
          characterData.isAttackButtonPressed = false;
        }
        break;
    }
  });

  let lastFrameTime = 0;
  function drawScene(frameTime: DOMHighResTimeStamp) {
    const deltaTime = frameTime - lastFrameTime;
    lastFrameTime = frameTime;

    if (characterData.movingTimeLeft !== undefined) {
      if (characterData.facing === "right") {
        characterData.x += deltaTime / 4;
      } else {
        characterData.x -= deltaTime / 4;
      }

      characterData.movingTimeLeft -= deltaTime;

      if (characterData.movingTimeLeft <= 0) {
        if (characterData.isMoving) {
          characterData.movingTimeLeft = 25;
        } else {
          characterData.movingTimeLeft = undefined;
        }
      }
    }

    if (characterData.attackingTime !== undefined) {
      characterData.attackingTime -= deltaTime;

      if (characterData.attackingTime <= 0) {
        characterData.attackingTime = undefined;
      }
    }

    // gl.clearColor(0, 0, 0, 0);
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    terrainProgram.bindVao();
    terrainProgram.useProgram();

    terrainProgram.drawTerrain({
      x: 0,
      y: 0,
      w: gl.canvas.width,
      h: gl.canvas.height,
      color: colorVectors.sky,
    });
    terrainProgram.drawTerrain({
      x: 0,
      y: gl.canvas.height - 50,
      w: gl.canvas.width,
      h: 50,
      color: colorVectors.ground,
    });
    terrainProgram.drawTerrain({
      x: gl.canvas.width / 6,
      y: gl.canvas.height - 175,
      w: gl.canvas.width / 6,
      h: 25,
      color: colorVectors.ground,
    });
    terrainProgram.drawTerrain({
      x: gl.canvas.width - gl.canvas.width / 3,
      y: gl.canvas.height - 175,
      w: gl.canvas.width / 6,
      h: 25,
      color: colorVectors.ground,
    });

    characterProgram.bindVao();
    characterProgram.useProgram();

    characterProgram.drawCharacter({
      x: 200,
      y:
        gl.canvas.height -
        50 -
        spriteSheetData["enemy-knight 0.aseprite"].h * SPRITE_SIZE_MULTIPLIER,
      w: spriteSheetData["enemy-knight 0.aseprite"].w,
      h: spriteSheetData["enemy-knight 0.aseprite"].h,
      grayOffsetColor: colorVectors.yellow,
      texCoords: spriteSheetData["enemy-knight 0.aseprite"].texCoords,
    });
    characterProgram.drawCharacter({
      x: 400,
      y:
        gl.canvas.height -
        50 -
        spriteSheetData["enemy-knight 0.aseprite"].h * SPRITE_SIZE_MULTIPLIER,
      w: spriteSheetData["enemy-knight 1.aseprite"].w,
      h: spriteSheetData["enemy-knight 1.aseprite"].h,
      grayOffsetColor: colorVectors.blue,
      texCoords: spriteSheetData["enemy-knight 1.aseprite"].texCoords,
    });
    characterProgram.drawCharacter({
      x: 600,
      y:
        gl.canvas.height -
        50 -
        spriteSheetData["enemy-knight 0.aseprite"].h * SPRITE_SIZE_MULTIPLIER,
      w: spriteSheetData["enemy-knight 1.aseprite"].w,
      h: spriteSheetData["enemy-knight 1.aseprite"].h,
      grayOffsetColor: colorVectors.red,
      texCoords: spriteSheetData["enemy-knight 1.aseprite"].texCoords,
    });

    characterProgram.drawCharacter({
      x: characterData.x,
      y:
        gl.canvas.height -
        50 -
        spriteSheetData["character-2 0.aseprite"].h * SPRITE_SIZE_MULTIPLIER,
      w: spriteSheetData["character-2 0.aseprite"].w,
      h: spriteSheetData["character-2 0.aseprite"].h,
      grayOffsetColor: colorVectors[characterData.swordColor],
      texCoords: characterData.attackingTime
        ? texCoordsCharacterAttacking
        : texCoordsCharacterStanding,
      flipX: characterData.facing === "left",
    });

    requestAnimationFrame(drawScene);
  }
  requestAnimationFrame(drawScene);
}
main();
