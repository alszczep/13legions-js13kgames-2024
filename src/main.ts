import { loadSpriteSheet } from "./assets/loadSpriteSheet";
import { getGl } from "./helpers/rendering/getGl";
import { glCreateTexture } from "./helpers/rendering/gl/glCreateTexture";
import { spriteSheetData } from "./assets/spriteSheetData";
import { colorKeys } from "./colors";
import { TerrainProgram } from "./programs/TerrainProgram";
import { CharacterProgram } from "./programs/CharacterProgram";
import { SPRITE_SIZE_MULTIPLIER } from "./consts";
import { Stage } from "./game/Stage";

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

  let currentStage = new Stage(
    { w: gl.canvas.width, h: gl.canvas.height },
    colorKeys.sky,
    colorKeys.ground,
    0.2,
    500,
    300
  );
  currentStage.spawnEnemy(
    spriteSheetData["enemy-knight 0.aseprite"],
    spriteSheetData["enemy-knight 1.aseprite"],
    100,
    gl.canvas.height -
      50 -
      spriteSheetData["enemy-knight 0.aseprite"].h * SPRITE_SIZE_MULTIPLIER,
    colorKeys.red
  );
  currentStage.spawnEnemy(
    spriteSheetData["enemy-knight 0.aseprite"],
    spriteSheetData["enemy-knight 1.aseprite"],
    200,
    gl.canvas.height -
      50 -
      spriteSheetData["enemy-knight 0.aseprite"].h * SPRITE_SIZE_MULTIPLIER,
    colorKeys.yellow
  );

  let lastFrameTime = 0;
  function drawScene(frameTime: DOMHighResTimeStamp) {
    const deltaTime = frameTime - lastFrameTime;
    lastFrameTime = frameTime;

    currentStage.player.handleFrame(deltaTime, currentStage.terrain);
    currentStage.enemies.forEach((enemy) => {
      enemy.handleFrame(deltaTime);
    });

    // gl.clearColor(0, 0, 0, 0);
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    terrainProgram.bindVao();
    terrainProgram.useProgram();

    currentStage.terrain.getDrawData().forEach((drawData) => {
      terrainProgram.drawTerrain(drawData);
    });

    characterProgram.bindVao();
    characterProgram.useProgram();

    currentStage.enemies.forEach((enemy) => {
      characterProgram.drawCharacter(enemy.getDrawData());
    });
    characterProgram.drawCharacter(currentStage.player.getDrawData());

    requestAnimationFrame(drawScene);
  }
  requestAnimationFrame(drawScene);
}
main();
