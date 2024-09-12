import { loadSpriteSheet } from "../assets/loadSpriteSheet";
import { getGl } from "../helpers/rendering/getGl";
import { glCreateTexture } from "../helpers/rendering/gl/glCreateTexture";
import { colorVectors } from "../colors";
import { TerrainProgram } from "../programs/TerrainProgram";
import { CharacterProgram } from "../programs/CharacterProgram";
import { StageManager } from "../game/stage/StageManager";
import { TextTexture } from "../game/ui/TextTexture";
import { TextProgram } from "../programs/TextProgram";
import { setupHpBar } from "../game/ui/setupHpBar";
import { StageModifiers } from "../types/GameDifficulty";
// TODO: comment out
// import Stats from "stats-js";

export type GameView = { stageModifiers: StageModifiers };

export async function gameView({ stageModifiers }: GameView) {
  const a = document.getElementById("a")!;
  a.style.display = "none";
  const b = document.getElementById("b")!;
  b.style.display = "flex";

  const gl = getGl();
  setupHpBar(gl.canvas.width);

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

  const sm = new StageManager(
    {
      w: gl.canvas.width,
      h: gl.canvas.height,
    },
    (stageName, opt) => {
      textTexture.updateText(stageName);
      textTexture.animate(opt);
    },
    stageModifiers
  );

  const startTime = performance.now();

  let lastFrameTime = 0;
  let gameOverHandled = false;

  // TODO: comment out
  // var stats = new Stats();
  // stats.showPanel(0);
  // document.body.appendChild(stats.dom);

  function drawScene(frameTime: DOMHighResTimeStamp) {
    // TODO: comment out
    // stats.begin();

    if (sm.currentStage.player._currentHp <= 0) {
      if (!gameOverHandled) {
        gameOverHandled = true;
        textTexture.updateText("You Died");
        textTexture.animate({ keepShown: true });
        sm.currentStage.player.onGameOver?.();
      }
    }

    const deltaTime = frameTime - lastFrameTime;
    lastFrameTime = frameTime;

    sm.currentStage.handleFrame(deltaTime, () => {
      textTexture.updateText(`${sm.currentStage.legionName} Defeated`);
      textTexture.animate();
    });

    textTexture.handleFrame(deltaTime);

    terrainProgram.bindVao();
    terrainProgram.useProgram();

    terrainProgram.drawTerrain({
      x: 0,
      y: 0,
      w: sm.currentStage.canvasSize.w,
      h: sm.currentStage.canvasSize.h,
      color: colorVectors[sm.currentStage.skyColor],
      isSky: true,
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
    sm.currentStage.rocksMap.forEach((rock) => {
      characterProgram.drawCharacter(rock.getDrawData());
    });

    textProgram.bindVao();
    textProgram.useProgram();

    textProgram.drawText(textTexture);

    // TODO: comment out
    // stats.end();
    requestAnimationFrame((t: DOMHighResTimeStamp) => drawScene(t - startTime));
  }
  requestAnimationFrame((t: DOMHighResTimeStamp) => drawScene(t - startTime));
}
