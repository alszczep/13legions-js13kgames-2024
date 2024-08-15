import { FLOAT_SIZE_IN_BYTES } from "../consts";
import { createProgram } from "../helpers/rendering/createProgram";
import { terrainFragmentShader } from "./terrain.fragmentShader";
import { terrainVertexShader } from "./terrain.vertexShader";

export const terrainShaderAttributes = {
  a_position: "a_position",
};

export const terrainShaderUniforms = {
  u_resolution: "u_resolution",
  u_color: "u_color",
};

export function createTerrainProgram(gl: WebGL2RenderingContext) {
  const terrainVao = gl.createVertexArray();
  gl.bindVertexArray(terrainVao);

  const terrainProgram = createProgram(
    gl,
    terrainVertexShader,
    terrainFragmentShader
  );

  const terrainProgramAttributesLocations = {
    [terrainShaderAttributes.a_position]: gl.getAttribLocation(
      terrainProgram,
      terrainShaderAttributes.a_position
    ),
  };
  const terrainProgramUniformsLocations = {
    [terrainShaderUniforms.u_resolution]: gl.getUniformLocation(
      terrainProgram,
      terrainShaderUniforms.u_resolution
    )!,
    [terrainShaderUniforms.u_color]: gl.getUniformLocation(
      terrainProgram,
      terrainShaderUniforms.u_color
    )!,
  };

  const terrainBuffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, terrainBuffer);

  const stride = 2 * FLOAT_SIZE_IN_BYTES;

  gl.enableVertexAttribArray(
    terrainProgramAttributesLocations[terrainShaderAttributes.a_position]
  );
  gl.vertexAttribPointer(
    terrainProgramAttributesLocations[terrainShaderAttributes.a_position],
    2,
    gl.FLOAT,
    false,
    stride,
    0
  );

  return {
    terrainVao,
    terrainProgram,
    terrainBuffer,
    terrainProgramAttributesLocations,
    terrainProgramUniformsLocations,
  };
}
