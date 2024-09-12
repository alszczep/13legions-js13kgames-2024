import { zzfx, ZZFX } from "zzfx";
import { LeftRight } from "../types/Directions";

export enum SoundEffect {
  PlayerAttack = 0,
  PlayerAttackHit = 1,
  PlayerGotHit = 2,
  Jump = 3,
}

export function playSound(s: SoundEffect, positionX?: LeftRight) {
  ZZFX.positionX = positionX === "<" ? -1 : positionX === ">" ? 1 : 0;

  switch (s) {
    case SoundEffect.PlayerAttack:
      // prettier-ignore
      zzfx(...[1.3,,358,.04,.03,.03,,3.9,6,,-91,.18,,.8,,,,.73,.02,,499]); // PlayerAttack
      break;
    case SoundEffect.PlayerAttackHit:
      // prettier-ignore
      zzfx(...[,,159,,.03,.27,4,.9,6,,,,,.4,,.1,,.52,.06,.25]); // PlayerAttackHit
      break;
    case SoundEffect.PlayerGotHit:
      // prettier-ignore
      zzfx(...[,,159,,.03,.27,4,.9,6,,,,,.2,,.03,,.52,.06,.25]); // PlayerGotHit
      break;
    case SoundEffect.Jump:
      // prettier-ignore
      zzfx(...[1.5,,483,,.02,.12,1,1.8,2,,,,,,,,.02,.9,.02]); // Jump?
      break;
  }
}
