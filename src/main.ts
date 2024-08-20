import { loadSpriteSheet } from "./assets/loadSpriteSheet";
import { getGl } from "./helpers/rendering/getGl";
import { glCreateTexture } from "./helpers/rendering/gl/glCreateTexture";
import { colorKeys, colorVectors } from "./colors";
import { TerrainProgram } from "./programs/TerrainProgram";
import { CharacterProgram } from "./programs/CharacterProgram";
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
    700,
    400,
    60,
    50,
    [5000, 6000],
    gl.canvas.width / 6
  );

  let lastFrameTime = 0;
  function drawScene(frameTime: DOMHighResTimeStamp) {
    if (currentStage.player.currentHp <= 0) {
      // TODO: GAME OVER
      return;
    }

    const deltaTime = frameTime - lastFrameTime;
    lastFrameTime = frameTime;

    currentStage.handleFrame(deltaTime);

    // gl.clearColor(0, 0, 0, 0);
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    terrainProgram.bindVao();
    terrainProgram.useProgram();

    terrainProgram.drawTerrain({
      x: 0,
      y: 0,
      w: currentStage.canvasSize.w,
      h: currentStage.canvasSize.h,
      color: colorVectors[currentStage.skyColor],
    });

    currentStage.terrain.getDrawData().forEach((drawData) => {
      terrainProgram.drawTerrain(drawData);
    });

    characterProgram.bindVao();
    characterProgram.useProgram();

    currentStage.knightEnemies.forEach((enemy) => {
      characterProgram.drawCharacter(enemy.getDrawData());
    });
    characterProgram.drawCharacter(currentStage.player.getDrawData());

    requestAnimationFrame(drawScene);
  }
  requestAnimationFrame(drawScene);
}
main();
