import { ZZFX } from "zzfx";

export function setupZzfx() {
  ZZFX.positionX = 0;
  ZZFX.playSamples = function (...samples: any[]) {
    const buffer = ZZFX.x.createBuffer(
      samples.length,
      samples[0].length,
      ZZFX.sampleRate
    );
    const source = ZZFX.x.createBufferSource();

    samples.map((d, i) => buffer.getChannelData(i).set(d));
    source.buffer = buffer;

    const panner = ZZFX.x.createPanner();
    panner.panningModel = "HRTF";
    panner.positionX.value = ZZFX.positionX;

    source.connect(panner);
    panner.connect(ZZFX.x.destination);

    source.start();
    return source;
  };
}
