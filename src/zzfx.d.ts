declare module "zzfx" {
  export function zzfx(...args: any[]): void;
  export const ZZFX: {
    volume: number;
    sampleRate: number;
    x: AudioContext;
    playSamples: (...args: any[]) => void;
    // added
    positionX: number;
  };
}
