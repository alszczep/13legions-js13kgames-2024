import spriteSheetSrc from "./spriteSheet.png";

export async function loadSpriteSheet() {
  const image = new Image();
  image.src = spriteSheetSrc;

  await new Promise((resolve) => {
    image.onload = () => {
      resolve(image);
    };
  });

  return image;
}
