import { loadSpriteSheet } from "./assets/loadSpriteSheet";
import { getGl } from "./helpers/rendering/getGl";
import { glCreateTexture } from "./helpers/rendering/gl/glCreateTexture";
import { spriteSheetData } from "./assets/spriteSheetData";
import { colorKeys, colorVectors } from "./colors";
import { TerrainProgram } from "./programs/TerrainProgram";
import { CharacterProgram } from "./programs/CharacterProgram";

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

  const characterData = {
    x: 0,
    y: 0,
    facing: "right",
    isAttacking: false,
    swordColor: colorKeys.red as keyof typeof colorKeys,
  };
  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "d":
        characterData.x += 5;
        characterData.facing = "right";
        break;
      case "a":
        characterData.x -= 5;
        characterData.facing = "left";
        break;
      case "w":
        characterData.y -= 5;
        break;
      case "s":
        characterData.y += 5;
        break;
      case "j":
        characterData.isAttacking = true;
        characterData.swordColor = colorKeys.red;
        break;
      case "k":
        characterData.isAttacking = true;
        characterData.swordColor = colorKeys.yellow;
        break;
      case "l":
        characterData.isAttacking = true;
        characterData.swordColor = colorKeys.blue;
        break;
    }
  });
  window.addEventListener("keyup", (e) => {
    if (["j", "k", "l"].includes(e.key)) {
      characterData.isAttacking = false;
    }
  });

  function drawScene() {
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
      y: gl.canvas.height - 100,
      w: gl.canvas.width,
      h: 100,
      color: colorVectors.ground,
    });

    characterProgram.bindVao();
    characterProgram.useProgram();

    characterProgram.drawCharacter({
      x: 0,
      y: 0,
      w: spriteSheetData["character-2 0.aseprite"].w,
      h: spriteSheetData["character-2 0.aseprite"].h,
      grayOffsetColor: colorVectors[characterData.swordColor],
      texCoords: characterData.isAttacking
        ? texCoordsCharacterAttacking
        : texCoordsCharacterStanding,
      flipX: characterData.facing === "left",
    });
    characterProgram.drawCharacter({
      x: 200,
      y: 0,
      w: spriteSheetData["enemy-knight 0.aseprite"].w,
      h: spriteSheetData["enemy-knight 0.aseprite"].h,
      grayOffsetColor: colorVectors.yellow,
      texCoords: spriteSheetData["enemy-knight 0.aseprite"].texCoords,
    });
    characterProgram.drawCharacter({
      x: 400,
      y: 0,
      w: spriteSheetData["enemy-knight 1.aseprite"].w,
      h: spriteSheetData["enemy-knight 1.aseprite"].h,
      grayOffsetColor: colorVectors.blue,
      texCoords: spriteSheetData["enemy-knight 1.aseprite"].texCoords,
    });
    characterProgram.drawCharacter({
      x: 600,
      y: 0,
      w: spriteSheetData["enemy-knight 1.aseprite"].w,
      h: spriteSheetData["enemy-knight 1.aseprite"].h,
      grayOffsetColor: colorVectors.red,
      texCoords: spriteSheetData["enemy-knight 1.aseprite"].texCoords,
    });

    requestAnimationFrame(drawScene);
  }
  requestAnimationFrame(drawScene);
}
main();
