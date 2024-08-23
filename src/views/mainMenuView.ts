import { stageModifiersDefinitions } from "../game/stage/stageModifiersDefinitions";
import { GameDifficulty } from "../types/GameDifficulty";
import { GameView } from "./gameView";

export async function mainMenuView(startGame: (gv: GameView) => void) {
  const container = document.getElementById("a")! as HTMLDivElement;

  const startButton = document.createElement("button");
  startButton.innerText = "Start";
  container.appendChild(startButton);
  startButton.onclick = () =>
    startGame({
      stageModifiers: stageModifiersDefinitions[GameDifficulty.Easy],
    });
}
