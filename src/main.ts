import { setupZzfx } from "./sound/setupZzfx";
import { gameView } from "./views/gameView";
import { mainMenuView } from "./views/mainMenuView";

setupZzfx();

mainMenuView(gameView);
