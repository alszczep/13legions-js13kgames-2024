declare module "stats-js" {
  export default class Stats {
    constructor();
    showPanel(value: number): void;
    begin(): void;
    end(): void;
    dom: HTMLDivElement;
  }
}

declare module "zzfx" {
  export function zzfx(...args: any[]): void;
}
