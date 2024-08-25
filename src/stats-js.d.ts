declare module "stats-js" {
  export default class Stats {
    constructor();
    showPanel(value: number): void;
    begin(): void;
    end(): void;
    dom: HTMLDivElement;
  }
}
