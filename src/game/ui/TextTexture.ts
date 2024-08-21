import { glCreateTexture } from "../../helpers/rendering/gl/glCreateTexture";
import { Dimensions } from "../../types/DimensionsAndCoordinates";

export class TextTexture {
  ctx: CanvasRenderingContext2D;
  gl: WebGL2RenderingContext;
  texture: ReturnType<typeof glCreateTexture>;

  constructor(gameCanvasSize: Dimensions, gl: WebGL2RenderingContext) {
    this.gl = gl;

    const canvas = document.createElement("canvas");
    canvas.width = gameCanvasSize.w;
    canvas.height = gameCanvasSize.h / 3;

    this.ctx = canvas.getContext("2d")!;

    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.font = "50px 'Courier New'";
    this.ctx.shadowColor = "#000000";

    this.texture = glCreateTexture(gl, canvas);
    gl.generateMipmap(gl.TEXTURE_2D);
  }

  updateText(text: string) {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.ctx.shadowBlur = 70;
    this.ctx.filter = "none";
    this.ctx.fillStyle = "#111111";
    this.ctx.roundRect(
      0,
      0,
      this.ctx.canvas.width,
      (this.ctx.canvas.height / 3) * 2 - 20,
      [0, 0, 20, 20]
    );
    this.ctx.fill();

    this.ctx.shadowBlur = 0;
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.fillText(
      text,
      this.ctx.canvas.width / 2,
      this.ctx.canvas.height / 3 - 10
    );
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture.texture);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      this.ctx.canvas
    );
    this.gl.generateMipmap(this.gl.TEXTURE_2D);
  }
}
