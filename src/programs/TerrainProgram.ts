import { FLOAT_SIZE_IN_BYTES } from "../consts";
import { dimensionsToRectangleVertices } from "../helpers/rendering/dimensionsToRectangleVertices";
import {
  terrainShaderAttributes,
  terrainShaderUniforms,
} from "../shaders/terrain.attributes";
import { terrainFragmentShader } from "../shaders/terrain.fragmentShader";
import { terrainVertexShader } from "../shaders/terrain.vertexShader";
import { DimensionsAndCoordinates } from "../types/DimensionsAndCoordinates";
import { Program } from "./_Program";

type Attributes =
  (typeof terrainShaderAttributes)[keyof typeof terrainShaderAttributes];
type Uniforms =
  (typeof terrainShaderUniforms)[keyof typeof terrainShaderUniforms];

export class TerrainProgram extends Program<Attributes, Uniforms> {
  constructor(gl: WebGL2RenderingContext) {
    super(gl, terrainVertexShader, terrainFragmentShader);

    this._saveAttributesLocations(["a_position"]);
    this._saveUniformsLocations(["u_resolution", "u_color"]);
  }

  _configureAttributes(): void {
    this.bindVao();

    const stride = 2 * FLOAT_SIZE_IN_BYTES;

    this.gl.enableVertexAttribArray(this.attributesLocations.a_position);
    this.gl.vertexAttribPointer(
      this.attributesLocations.a_position,
      2,
      this.gl.FLOAT,
      false,
      stride,
      0
    );
  }

  drawTerrain({
    x,
    y,
    w,
    h,
    color,
  }: DimensionsAndCoordinates & { color: [number, number, number] }) {
    this.gl.uniform3fv(this.uniformsLocations.u_color, new Float32Array(color));

    this.bindBuffer();
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(
        dimensionsToRectangleVertices({
          x,
          y,
          w,
          h,
        })
      ),
      this.gl.STATIC_DRAW
    );

    this.gl.drawArrays(this.gl.TRIANGLES, 0, 1 * 6);
  }
}
