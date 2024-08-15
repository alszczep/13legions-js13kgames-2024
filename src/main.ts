import { loadSpriteSheet } from "./assets/loadSpriteSheet";
import { getGl } from "./getGl";
import { createProgram } from "./createProgram";
import { glCreateTexture } from "./helpers/glCreateTexture";
import { spriteSheetData } from "./assets/spriteSheetData";
import { FLOAT_SIZE_IN_BYTES } from "./consts";
import { colorKeys, colorVectors } from "./colors";
import { drawCharacter } from "./helpers/drawCharacter";

async function main() {
  const spriteSheet = await loadSpriteSheet();

  const gl = getGl();

  const program = createProgram(gl);

  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  const texCoordAttributeLocation = gl.getAttribLocation(program, "a_texCoord");

  const resolutionUniformLocation = gl.getUniformLocation(
    program,
    "u_resolution"
  )!;
  const imageUniformLocation = gl.getUniformLocation(program, "u_image")!;
  const grayOffsetColorUniformLocation = gl.getUniformLocation(
    program,
    "u_grayOffsetColor"
  )!;

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const charactersBuffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, charactersBuffer);

  const stride = 4 * FLOAT_SIZE_IN_BYTES;

  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(
    positionAttributeLocation,
    2,
    gl.FLOAT,
    false,
    stride,
    0
  );
  gl.enableVertexAttribArray(texCoordAttributeLocation);
  gl.vertexAttribPointer(
    texCoordAttributeLocation,
    2,
    gl.FLOAT,
    false,
    stride,
    2 * FLOAT_SIZE_IN_BYTES
  );

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

  gl.useProgram(program);

  gl.bindVertexArray(vao);

  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
  gl.uniform1i(imageUniformLocation, spriteSheetTexture.id);

  function drawScene() {
    // gl.clearColor(0, 0, 0, 0);
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const playerCharacterTexCoords = characterData.isAttacking
      ? texCoordsCharacterAttacking
      : texCoordsCharacterStanding;

    drawCharacter(gl, grayOffsetColorUniformLocation, charactersBuffer, {
      x: characterData.x,
      y: characterData.y,
      w: spriteSheetData["character-2 0.aseprite"].w,
      h: spriteSheetData["character-2 0.aseprite"].h,
      grayOffsetColor: colorVectors[characterData.swordColor],
      texCoords: playerCharacterTexCoords,
      flipX: characterData.facing === "left",
    });

    drawCharacter(gl, grayOffsetColorUniformLocation, charactersBuffer, {
      x: 200,
      y: 0,
      w: spriteSheetData["enemy-knight 0.aseprite"].w,
      h: spriteSheetData["enemy-knight 0.aseprite"].h,
      grayOffsetColor: colorVectors.yellow,
      texCoords: spriteSheetData["enemy-knight 0.aseprite"].texCoords,
    });
    drawCharacter(gl, grayOffsetColorUniformLocation, charactersBuffer, {
      x: 400,
      y: 0,
      w: spriteSheetData["enemy-knight 1.aseprite"].w,
      h: spriteSheetData["enemy-knight 1.aseprite"].h,
      grayOffsetColor: colorVectors.blue,
      texCoords: spriteSheetData["enemy-knight 1.aseprite"].texCoords,
    });

    requestAnimationFrame(drawScene);
  }
  requestAnimationFrame(drawScene);
}
main();
