import { loadSpriteSheet } from "./assets/loadSpriteSheet";
import { getGl } from "./getGl";
import { createProgram } from "./createProgram";
import { glCreateTexture } from "./helpers/glCreateTexture";
import { spriteSheetData } from "./assets/spriteSheetData";
import { dimensionsToRectangleVertices } from "./helpers/dimensionsToRectangleVertices";

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

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  // const positions = new Float32Array([
  //   10, 20, 80, 20, 10, 30, 10, 30, 80, 20, 80, 30,
  // ]);
  // gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  const texCoordBuffer = gl.createBuffer();
  const texCoordsCharacterStanding =
    spriteSheetData["character-2 0.aseprite"].texCoords;
  const texCoordsCharacterAttacking =
    spriteSheetData["character-2 1.aseprite"].texCoords;

  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      ...texCoordsCharacterStanding,
      ...texCoordsCharacterAttacking,
    ]),
    gl.STATIC_DRAW
  );

  gl.enableVertexAttribArray(texCoordAttributeLocation);
  gl.vertexAttribPointer(texCoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);

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

  const emptyPosition = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  };

  function drawScene() {
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(program);

    gl.bindVertexArray(vao);

    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    gl.uniform1i(imageUniformLocation, spriteSheetTexture.id);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const characterStanding = characterData.isAttacking
      ? dimensionsToRectangleVertices(emptyPosition)
      : dimensionsToRectangleVertices(
          {
            x: characterData.x,
            y: characterData.y,
            w: spriteSheetData["character-2 0.aseprite"].w * 2,
            h: spriteSheetData["character-2 0.aseprite"].h * 2,
          },
          { flipX: characterData.facing === "left" }
        );

    const characterAttacking = characterData.isAttacking
      ? dimensionsToRectangleVertices(
          {
            x: characterData.x,
            y: characterData.y,
            w: spriteSheetData["character-2 1.aseprite"].w * 2,
            h: spriteSheetData["character-2 1.aseprite"].h * 2,
          },
          { flipX: characterData.facing === "left" }
        )
      : dimensionsToRectangleVertices(emptyPosition);

    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([...characterStanding, ...characterAttacking]),
      gl.DYNAMIC_DRAW
    );

    gl.drawArrays(gl.TRIANGLES, 0, 2 * 6);

    requestAnimationFrame(drawScene);
  }
  requestAnimationFrame(drawScene);
}
main();
