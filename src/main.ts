import { loadSpriteSheet } from "./assets/loadSpriteSheet";
import { getGl } from "./helpers/rendering/getGl";
import { glCreateTexture } from "./helpers/rendering/gl/glCreateTexture";
import { colorVectors } from "./colors";
import { TerrainProgram } from "./programs/TerrainProgram";
import { CharacterProgram } from "./programs/CharacterProgram";
import { StageManager } from "./game/StageManager";

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

  const sm = new StageManager({
    w: gl.canvas.width,
    h: gl.canvas.height,
  });

  let lastFrameTime = 0;
  function drawScene(frameTime: DOMHighResTimeStamp) {
    if (sm.currentStage.player.currentHp <= 0) {
      // TODO: GAME OVER
      return;
    }

    const deltaTime = frameTime - lastFrameTime;
    lastFrameTime = frameTime;

    sm.currentStage.handleFrame(deltaTime);

    // gl.clearColor(0, 0, 0, 0);
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    terrainProgram.bindVao();
    terrainProgram.useProgram();

    terrainProgram.drawTerrain({
      x: 0,
      y: 0,
      w: sm.currentStage.canvasSize.w,
      h: sm.currentStage.canvasSize.h,
      color: colorVectors[sm.currentStage.skyColor],
    });

    sm.currentStage.terrain.getDrawData().forEach((drawData) => {
      terrainProgram.drawTerrain(drawData);
    });

    characterProgram.bindVao();
    characterProgram.useProgram();

    sm.currentStage.knightEnemies.forEach((enemy) => {
      characterProgram.drawCharacter(enemy.getDrawData());
    });
    characterProgram.drawCharacter(sm.currentStage.player.getDrawData());

    requestAnimationFrame(drawScene);
  }
  requestAnimationFrame(drawScene);
}
main();
