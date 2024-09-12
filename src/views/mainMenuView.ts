import { stageModifiersDefinitions } from "../game/stage/stageModifiersDefinitions";
import { GameDifficulty } from "../types/GameDifficulty";
import { GameView } from "./gameView";
import logoImg from "../assets/logo.png";

export async function mainMenuView(startGame: (gv: GameView) => void) {
  const container = document.getElementById("a")! as HTMLDivElement;

  const westButton = container.querySelector(".t.w")! as HTMLDivElement;
  const southButton = container.querySelector(".t.s")! as HTMLDivElement;
  const eastButton = container.querySelector(".t.e")! as HTMLDivElement;
  const northButton = container.querySelector(".t.n")! as HTMLDivElement;

  const logo = container.querySelector("#l")! as HTMLImageElement;
  logo.src = logoImg;

  westButton.addEventListener("click", () => {
    startGame({
      stageModifiers: stageModifiersDefinitions[GameDifficulty.Easy],
    });
  });
  southButton.addEventListener("click", () => {
    startGame({
      stageModifiers: stageModifiersDefinitions[GameDifficulty.Normal],
    });
  });
  eastButton.addEventListener("click", () => {
    startGame({
      stageModifiers: stageModifiersDefinitions[GameDifficulty.Hard],
    });
  });
  northButton.addEventListener("click", () => {
    startGame({
      stageModifiers: stageModifiersDefinitions[GameDifficulty.Nightmare],
    });
  });
}
