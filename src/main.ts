import { loadSpriteSheet } from "./assets/loadSpriteSheet";
import { getGl } from "./helpers/rendering/getGl";

import { glCreateTexture } from "./helpers/rendering/gl/glCreateTexture";
import { spriteSheetData } from "./assets/spriteSheetData";
import { colorKeys, colorVectors } from "./colors";
import {
  characterShaderUniforms,
  createCharacterProgram,
} from "./shaders/character.createProgram";
import {
  createTerrainProgram,
  terrainShaderUniforms,
} from "./shaders/terrain.createProgram";
import { drawCharacter } from "./helpers/rendering/drawCharacter";
import { dimensionsToRectangleVertices } from "./helpers/rendering/dimensionsToRectangleVertices";

async function main() {
  const spriteSheet = await loadSpriteSheet();

  const gl = getGl();

  const {
    terrainVao,
    terrainProgram,
    terrainBuffer,
    terrainProgramUniformsLocations,
  } = createTerrainProgram(gl);
  const {
    characterVao,
    characterProgram,
    characterBuffer,
    characterProgramUniformsLocations,
  } = createCharacterProgram(gl);

  const texCoordsCharacterStanding =
    spriteSheetData["character-2 0.aseprite"].texCoords;
  const texCoordsCharacterAttacking =
    spriteSheetData["character-2 1.aseprite"].texCoords;

  const spriteSheetTexture = glCreateTexture(gl, spriteSheet);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

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

  // gl.bindVertexArray(vao);

  gl.bindVertexArray(terrainVao);
  gl.useProgram(terrainProgram);
  gl.uniform2f(
    terrainProgramUniformsLocations[terrainShaderUniforms.u_resolution],
    gl.canvas.width,
    gl.canvas.height
  );

  gl.bindVertexArray(characterVao);
  gl.useProgram(characterProgram);
  gl.uniform2f(
    characterProgramUniformsLocations[characterShaderUniforms.u_resolution],
    gl.canvas.width,
    gl.canvas.height
  );
  gl.uniform1i(
    characterProgramUniformsLocations[characterShaderUniforms.u_image],
    spriteSheetTexture.id
  );

  function drawScene() {
    // gl.clearColor(0, 0, 0, 0);
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.bindVertexArray(terrainVao);
    gl.useProgram(terrainProgram);

    gl.uniform3fv(
      terrainProgramUniformsLocations[terrainShaderUniforms.u_color],
      colorVectors.sky
    );
    gl.bindBuffer(gl.ARRAY_BUFFER, terrainBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(
        dimensionsToRectangleVertices({
          x: 0,
          y: 0,
          w: gl.canvas.width,
          h: gl.canvas.height,
        })
      ),
      gl.STATIC_DRAW
    );

    gl.drawArrays(gl.TRIANGLES, 0, 1 * 6);

    gl.uniform3fv(
      terrainProgramUniformsLocations[terrainShaderUniforms.u_color],
      colorVectors.ground
    );
    gl.bindBuffer(gl.ARRAY_BUFFER, terrainBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(
        dimensionsToRectangleVertices({
          x: 0,
          y: gl.canvas.height - 100,
          w: gl.canvas.width,
          h: 100,
        })
      ),
      gl.STATIC_DRAW
    );

    gl.drawArrays(gl.TRIANGLES, 0, 1 * 6);

    gl.bindVertexArray(characterVao);
    gl.useProgram(characterProgram);
    // gl.uniform2f(
    //   characterProgramUniformsLocations[characterShaderUniforms.u_resolution],
    //   gl.canvas.width,
    //   gl.canvas.height
    // );
    // gl.uniform1i(
    //   characterProgramUniformsLocations[characterShaderUniforms.u_image],
    //   spriteSheetTexture.id
    // );

    drawCharacter(
      gl,
      characterProgramUniformsLocations[characterShaderUniforms.u_color],
      characterBuffer,
      {
        x: characterData.x,
        y: characterData.y,
        w: spriteSheetData["character-2 0.aseprite"].w,
        h: spriteSheetData["character-2 0.aseprite"].h,
        grayOffsetColor: colorVectors[characterData.swordColor],
        texCoords: characterData.isAttacking
          ? texCoordsCharacterAttacking
          : texCoordsCharacterStanding,
        flipX: characterData.facing === "left",
      }
    );

    drawCharacter(
      gl,
      characterProgramUniformsLocations[characterShaderUniforms.u_color],
      characterBuffer,
      {
        x: 200,
        y: 0,
        w: spriteSheetData["enemy-knight 0.aseprite"].w,
        h: spriteSheetData["enemy-knight 0.aseprite"].h,
        grayOffsetColor: colorVectors.yellow,
        texCoords: spriteSheetData["enemy-knight 0.aseprite"].texCoords,
      }
    );
    drawCharacter(
      gl,
      characterProgramUniformsLocations[characterShaderUniforms.u_color],
      characterBuffer,
      {
        x: 400,
        y: 0,
        w: spriteSheetData["enemy-knight 1.aseprite"].w,
        h: spriteSheetData["enemy-knight 1.aseprite"].h,
        grayOffsetColor: colorVectors.blue,
        texCoords: spriteSheetData["enemy-knight 1.aseprite"].texCoords,
      }
    );

    requestAnimationFrame(drawScene);
  }
  requestAnimationFrame(drawScene);
}
main();
