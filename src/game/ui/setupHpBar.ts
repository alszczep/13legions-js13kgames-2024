const hpBarInnerId = "hpi";
const hpBarTextId = "hpt";

export function setupHpBar(canvasWidth: number) {
  const container = document.querySelector<HTMLDivElement>("#hp")!;

  container.style.width = `${canvasWidth}px`;
  container.style.height = "60px";
  container.style.background = "#222";
  container.style.padding = "8px";
  container.style.position = "relative";

  const hpBarInner = document.createElement("div");
  hpBarInner.id = hpBarInnerId;
  hpBarInner.style.width = "100%";
  hpBarInner.style.height = "100%";
  hpBarInner.style.background = "#E00000";

  container.appendChild(hpBarInner);

  const hpBarText = document.createElement("div");
  hpBarText.id = hpBarTextId;
  hpBarText.style.color = "#FFFFFF";
  hpBarText.style.fontSize = "24px";
  hpBarText.style.fontWeight = "700";
  hpBarText.style.position = "absolute";
  hpBarText.style.top = "50%";
  hpBarText.style.left = "50%";
  hpBarText.style.transform = "translate(-50%, -50%)";

  hpBarInner.appendChild(hpBarText);
}

export function updateHpBar(hp: number, maxHp: number) {
  const hpBarInner = document.getElementById(hpBarInnerId)! as HTMLDivElement;
  const hpBarText = document.getElementById(hpBarTextId)! as HTMLDivElement;

  hpBarInner.style.width = `${(hp / maxHp) * 100}%`;
  hpBarText.innerText = `${hp} / ${maxHp}`;
}
