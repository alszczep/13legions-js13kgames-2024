import { createProgram } from "../helpers/rendering/createProgram";

export abstract class Program<
  TAttribute extends string,
  TUniform extends string
> {
  gl: WebGL2RenderingContext;
  vao: WebGLVertexArrayObject;
  program: WebGLProgram;
  buffer: WebGLBuffer;
  attributesLocations: Record<TAttribute, number> = {} as any;
  uniformsLocations: Record<TUniform, WebGLUniformLocation> = {} as any;

  constructor(
    gl: WebGL2RenderingContext,
    vertexShaderSource: string,
    fragmentShaderSource: string
  ) {
    this.gl = gl;

    this.vao = this.gl.createVertexArray()!;
    this.bindVao();

    this.program = createProgram(
      this.gl,
      vertexShaderSource,
      fragmentShaderSource
    );

    this.buffer = this.gl.createBuffer()!;
    this.bindBuffer();
  }

  bindVao() {
    this.gl.bindVertexArray(this.vao);
  }

  useProgram() {
    this.gl.useProgram(this.program);
  }

  bindBuffer() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
  }

  saveAttributesLocations(attributes: TAttribute[]) {
    const attributesLocations = {} as Record<TAttribute, number>;

    for (const attribute of attributes) {
      attributesLocations[attribute] = this.gl.getAttribLocation(
        this.program,
        attribute
      );
    }

    this.attributesLocations = attributesLocations;

    this.configureAttributes();
  }

  saveUniformsLocations(uniforms: TUniform[]) {
    const uniformsLocations = {} as Record<TUniform, WebGLUniformLocation>;

    for (const uniform of uniforms) {
      uniformsLocations[uniform] = this.gl.getUniformLocation(
        this.program,
        uniform
      )!;
    }

    this.uniformsLocations = uniformsLocations;
  }

  abstract configureAttributes(): void;
}
