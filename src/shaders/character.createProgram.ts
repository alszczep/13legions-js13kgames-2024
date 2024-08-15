import { FLOAT_SIZE_IN_BYTES } from "../consts";
import { createProgram } from "../helpers/rendering/createProgram";
import { characterFragmentShader } from "./character.fragmentShader";
import { characterVertexShader } from "./character.vertexShader";

export const characterShaderAttributes = {
  a_position: "a_position",
  a_texCoord: "a_texCoord",
} as const;

export const characterShaderUniforms = {
  u_resolution: "u_resolution",
  u_image: "u_image",
  u_color: "u_color",
} as const;

export function createCharacterProgram(gl: WebGL2RenderingContext) {
  const characterVao = gl.createVertexArray();
  gl.bindVertexArray(characterVao);

  const characterProgram = createProgram(
    gl,
    characterVertexShader,
    characterFragmentShader
  );

  const characterProgramAttributesLocations = {
    [characterShaderAttributes.a_position]: gl.getAttribLocation(
      characterProgram,
      characterShaderAttributes.a_position
    ),
    [characterShaderAttributes.a_texCoord]: gl.getAttribLocation(
      characterProgram,
      characterShaderAttributes.a_texCoord
    ),
  };
  const characterProgramUniformsLocations = {
    [characterShaderUniforms.u_resolution]: gl.getUniformLocation(
      characterProgram,
      characterShaderUniforms.u_resolution
    )!,
    [characterShaderUniforms.u_image]: gl.getUniformLocation(
      characterProgram,
      characterShaderUniforms.u_image
    )!,
    [characterShaderUniforms.u_color]: gl.getUniformLocation(
      characterProgram,
      characterShaderUniforms.u_color
    )!,
  };

  const characterBuffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, characterBuffer);

  const stride = 4 * FLOAT_SIZE_IN_BYTES;

  gl.enableVertexAttribArray(
    characterProgramAttributesLocations[characterShaderAttributes.a_position]
  );
  gl.vertexAttribPointer(
    characterProgramAttributesLocations[characterShaderAttributes.a_position],
    2,
    gl.FLOAT,
    false,
    stride,
    0
  );
  gl.enableVertexAttribArray(
    characterProgramAttributesLocations[characterShaderAttributes.a_texCoord]
  );
  gl.vertexAttribPointer(
    characterProgramAttributesLocations[characterShaderAttributes.a_texCoord],
    2,
    gl.FLOAT,
    false,
    stride,
    2 * FLOAT_SIZE_IN_BYTES
  );

  return {
    characterVao,
    characterProgram,
    characterBuffer,
    characterProgramAttributesLocations,
    characterProgramUniformsLocations,
  };
}
