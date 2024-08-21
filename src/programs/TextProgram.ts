import { FLOAT_SIZE_IN_BYTES } from "../consts";
import { TextTexture } from "../game/ui/TextTexture";
import { combineVertexAttributeValues } from "../helpers/rendering/combinePositionAndTexCords";
import { dimensionsToRectangleVertices } from "../helpers/rendering/dimensionsToRectangleVertices";
import {
  textShaderAttributes,
  textShaderUniforms,
} from "../shaders/text.attributes";
import { textFragmentShader } from "../shaders/text.fragmentShader";
import { textVertexShader } from "../shaders/text.vertexShader";
import { Program } from "./_Program";

type Attributes =
  (typeof textShaderAttributes)[keyof typeof textShaderAttributes];
type Uniforms = (typeof textShaderUniforms)[keyof typeof textShaderUniforms];

export class TextProgram extends Program<Attributes, Uniforms> {
  constructor(gl: WebGL2RenderingContext) {
    super(gl, textVertexShader, textFragmentShader);

    this.saveAttributesLocations(["a_position", "a_texCoord"]);
    this.saveUniformsLocations(["u_resolution", "u_image"]);
  }

  configureAttributes(): void {
    this.bindVao();

    const stride = 4 * FLOAT_SIZE_IN_BYTES;

    this.gl.enableVertexAttribArray(this.attributesLocations.a_position);
    this.gl.vertexAttribPointer(
      this.attributesLocations.a_position,
      2,
      this.gl.FLOAT,
      false,
      stride,
      0
    );
    this.gl.enableVertexAttribArray(this.attributesLocations.a_texCoord);
    this.gl.vertexAttribPointer(
      this.attributesLocations.a_texCoord,
      2,
      this.gl.FLOAT,
      false,
      stride,
      2 * FLOAT_SIZE_IN_BYTES
    );
  }

  drawText(textTexture: TextTexture) {
    const textPosition = dimensionsToRectangleVertices({
      x: 0,
      y: 0,
      w: textTexture.ctx.canvas.width,
      h: textTexture.ctx.canvas.height,
    });

    const texCoords = dimensionsToRectangleVertices({
      x: 0,
      y: 0,
      w: 1,
      h: 1,
    });

    this.bindBuffer();
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(
        combineVertexAttributeValues({
          elementsPerVertex: [2, 2],
          values: [textPosition, texCoords],
        })
      ),
      this.gl.DYNAMIC_DRAW
    );

    this.gl.drawArrays(this.gl.TRIANGLES, 0, 1 * 6);
  }
}
