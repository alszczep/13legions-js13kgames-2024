import { FLOAT_SIZE_IN_BYTES } from "../consts";
import { combineVertexAttributeValues } from "../helpers/rendering/combinePositionAndTexCords";
import { dimensionsToRectangleVertices } from "../helpers/rendering/dimensionsToRectangleVertices";
import {
  characterShaderAttributes,
  characterShaderUniforms,
} from "../shaders/character.attributes";
import { characterFragmentShader } from "../shaders/character.fragmentShader";
import { characterVertexShader } from "../shaders/character.vertexShader";
import { DimensionsAndCoordinates } from "../types/DimensionsAndCoordinates";
import { Program } from "./_Program";

type Attributes =
  (typeof characterShaderAttributes)[keyof typeof characterShaderAttributes];
type Uniforms =
  (typeof characterShaderUniforms)[keyof typeof characterShaderUniforms];

export type DrawCharacterParams = {
  texCoords: number[];
  grayOffsetColor: [number, number, number];
  flipX?: boolean;
} & DimensionsAndCoordinates;

export class CharacterProgram extends Program<Attributes, Uniforms> {
  constructor(gl: WebGL2RenderingContext) {
    super(gl, characterVertexShader, characterFragmentShader);

    this.saveAttributesLocations(["a_position", "a_texCoord"]);
    this.saveUniformsLocations(["u_resolution", "u_image", "u_color"]);
  }

  configureAttributes() {
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

  drawCharacter({
    x,
    y,
    w,
    h,
    texCoords,
    grayOffsetColor,
    flipX,
  }: DrawCharacterParams) {
    this.gl.uniform3fv(
      this.uniformsLocations.u_color,
      new Float32Array(grayOffsetColor)
    );

    const playerCharacterPosition = dimensionsToRectangleVertices(
      {
        x,
        y,
        w,
        h,
      },
      { flipX }
    );

    this.bindBuffer();
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(
        combineVertexAttributeValues({
          elementsPerVertex: [2, 2],
          values: [playerCharacterPosition, texCoords],
        })
      ),
      this.gl.DYNAMIC_DRAW
    );

    this.gl.drawArrays(this.gl.TRIANGLES, 0, 1 * 6);
  }
}
