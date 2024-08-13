import { loadSpriteSheet } from "./assets/loadSpriteSheet";
import { getGl } from "./getGl";
import { createProgram } from "./createProgram";
import { glCreateTexture } from "./helpers/glCreateTexture";
import { spriteSheetData } from "./assets/spriteSheetData";
import { dimensionsToRectangleVertices } from "./helpers/dimensionsToRectangleVertices";
import { FLOAT_SIZE_IN_BYTES, SPRITE_SIZE_MULTIPLIER } from "./consts";
import { combineVertexAttributeValues } from "./helpers/combinePositionAndTexCords";
import { colorIdFor6Vertices, FragmentShaderColorsIds } from "./colors";

async function main() {
  const spriteSheet = await loadSpriteSheet();

  const gl = getGl();

  const program = createProgram(gl);

  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  const texCoordAttributeLocation = gl.getAttribLocation(program, "a_texCoord");
  const colorToOffsetGrayIdAttributeLocation = gl.getAttribLocation(
    program,
    "a_colorToOffsetGrayId"
  );

  const resolutionUniformLocation = gl.getUniformLocation(
    program,
    "u_resolution"
  );
  const imageUniformLocation = gl.getUniformLocation(program, "u_image");

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const charactersBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, charactersBuffer);

  const stride = 5 * FLOAT_SIZE_IN_BYTES;

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
  gl.enableVertexAttribArray(colorToOffsetGrayIdAttributeLocation);
  gl.vertexAttribPointer(
    colorToOffsetGrayIdAttributeLocation,
    1,
    gl.FLOAT,
    false,
    stride,
    4 * FLOAT_SIZE_IN_BYTES
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
    swordColor: FragmentShaderColorsIds.Red,
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
        characterData.swordColor = FragmentShaderColorsIds.Red;
        break;
      case "k":
        characterData.isAttacking = true;
        characterData.swordColor = FragmentShaderColorsIds.Green;
        break;
      case "l":
        characterData.isAttacking = true;
        characterData.swordColor = FragmentShaderColorsIds.Blue;
        break;
    }
  });
  window.addEventListener("keyup", (e) => {
    if (["j", "k", "l"].includes(e.key)) {
      characterData.isAttacking = false;
    }
  });

  function drawScene() {
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(program);

    gl.bindVertexArray(vao);

    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    gl.uniform1i(imageUniformLocation, spriteSheetTexture.id);

    const playerCharacterPosition = dimensionsToRectangleVertices(
      {
        x: characterData.x,
        y: characterData.y,
        w: spriteSheetData["character-2 0.aseprite"].w * SPRITE_SIZE_MULTIPLIER,
        h: spriteSheetData["character-2 0.aseprite"].h * SPRITE_SIZE_MULTIPLIER,
      },
      { flipX: characterData.facing === "left" }
    );
    const playerCharacterTexCoords = characterData.isAttacking
      ? texCoordsCharacterAttacking
      : texCoordsCharacterStanding;

    gl.bindBuffer(gl.ARRAY_BUFFER, charactersBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(
        combineVertexAttributeValues({
          elementsPerVertex: [2, 2, 1],
          values: [
            playerCharacterPosition,
            playerCharacterTexCoords,
            colorIdFor6Vertices(characterData.swordColor),
          ],
        })
      ),
      gl.DYNAMIC_DRAW
    );

    gl.drawArrays(gl.TRIANGLES, 0, 1 * 6);

    requestAnimationFrame(drawScene);
  }
  requestAnimationFrame(drawScene);
}
main();
