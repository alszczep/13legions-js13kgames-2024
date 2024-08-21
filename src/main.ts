import { loadSpriteSheet } from "./assets/loadSpriteSheet";
import { getGl } from "./helpers/rendering/getGl";
import { glCreateTexture } from "./helpers/rendering/gl/glCreateTexture";
import { colorVectors } from "./colors";
import { TerrainProgram } from "./programs/TerrainProgram";
import { CharacterProgram } from "./programs/CharacterProgram";
import { StageManager } from "./game/StageManager";
import { TextTexture } from "./game/ui/TextTexture";
import { TextProgram } from "./programs/TextProgram";

async function main() {
  const gl = getGl();

  const spriteSheet = await loadSpriteSheet();
  const spriteSheetTexture = glCreateTexture(gl, spriteSheet);

  const textTexture = new TextTexture(
    {
      w: gl.canvas.width,
      h: gl.canvas.height,
    },
    gl
  );

  const terrainProgram = new TerrainProgram(gl);
  const characterProgram = new CharacterProgram(gl);
  const textProgram = new TextProgram(gl);

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

  textProgram.bindVao();
  textProgram.useProgram();
  gl.uniform2f(
    textProgram.uniformsLocations.u_resolution,
    gl.canvas.width,
    gl.canvas.height
  );
  gl.uniform1i(textProgram.uniformsLocations.u_image, textTexture.texture.id);

  const sm = new StageManager({
    w: gl.canvas.width,
    h: gl.canvas.height,
  });
  textTexture.updateText("Legion Annihilated");

  let lastFrameTime = 0;
  function drawScene(frameTime: DOMHighResTimeStamp) {
    if (sm.currentStage.player.currentHp <= 0) {
      textTexture.updateText("You Died");
      sm.currentStage.player.onGameOver?.();
    }

    const deltaTime = frameTime - lastFrameTime;
    lastFrameTime = frameTime;

    sm.currentStage.handleFrame(deltaTime);

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

    textProgram.bindVao();
    textProgram.useProgram();

    textProgram.drawText(textTexture);

    requestAnimationFrame(drawScene);
  }
  requestAnimationFrame(drawScene);
}
main();
