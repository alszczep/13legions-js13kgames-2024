// find bugs in this code, now I can see only some line on the screen where the sprite should be
import { loadSpriteSheet } from "./assets/loadSpriteSheet";
import { getGl } from "./getGl";
import { createProgram } from "./createProgram";
import { glCreateTexture } from "./helpers/glCreateTexture";
import { spriteSheetData } from "./assets/spriteSheetData";
import { dimensionsToRectangleVertices } from "./helpers/dimensionsToRectangleVertices";
import { FLOAT_SIZE_IN_BYTES, SPRITE_SIZE_MULTIPLIER } from "./consts";
import { combinePositionAndTexCords } from "./helpers/combinePositionAndTexCords";

async function main() {
  const spriteSheet = await loadSpriteSheet();

  const gl = getGl();

  const program = createProgram(gl);

  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  const texCoordAttributeLocation = gl.getAttribLocation(program, "a_texCoord");

  const resolutionUniformLocation = gl.getUniformLocation(
    program,
    "u_resolution"
  );
  const imageUniformLocation = gl.getUniformLocation(program, "u_image");

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const charactersBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, charactersBuffer);

  const offset = 4 * FLOAT_SIZE_IN_BYTES;

  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(
    positionAttributeLocation,
    2,
    gl.FLOAT,
    false,
    offset,
    0
  );
  gl.enableVertexAttribArray(texCoordAttributeLocation);
  gl.vertexAttribPointer(
    texCoordAttributeLocation,
    2,
    gl.FLOAT,
    false,
    offset,
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
  };
  window.addEventListener("keydown", (e) => {
    if (e.key === "d") {
      characterData.x += 5;
      characterData.facing = "right";
    }
    if (e.key === "a") {
      characterData.x -= 5;
      characterData.facing = "left";
    }
    if (e.key === "w") {
      characterData.y -= 5;
    }
    if (e.key === "s") {
      characterData.y += 5;
    }
    if (e.key === "j") {
      characterData.isAttacking = true;
    }
  });
  window.addEventListener("keyup", (e) => {
    if (e.key === "j") {
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
        combinePositionAndTexCords(
          playerCharacterPosition,
          playerCharacterTexCoords
        )
      ),
      gl.DYNAMIC_DRAW
    );

    gl.drawArrays(gl.TRIANGLES, 0, 1 * 6);

    requestAnimationFrame(drawScene);
  }
  requestAnimationFrame(drawScene);
}
main();
