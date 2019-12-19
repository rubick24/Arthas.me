const loadShader = (gl, type, source) => {
  const shader = gl.createShader(type)
  if (!shader) {
    throw new Error('can not create shader')
  }
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const errMsg = `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`
    gl.deleteShader(shader)
    throw new Error(errMsg)
  }
  return shader
}
export default class Shader {
  constructor(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource)
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)
    const shaderProgram = gl.createProgram()
    if (!shaderProgram) {
      throw new Error('can not create shader program')
    }
    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)
    gl.linkProgram(shaderProgram)
    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      throw new Error(
        `Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`
      )
    }
    this.gl = gl
    this.program = shaderProgram
  }

  use() {
    this.gl.useProgram(this.program)
  }
  setUniform(name, type, value) {
    const stex = this.gl.getUniformLocation(this.program, name)
    switch (type) {
      case 'BOOLEAN':
        return this.gl.uniform1i(stex, Number(value))
      case 'INT':
        return this.gl.uniform1i(stex, Math.round(value))
      case 'FLOAT':
        return this.gl.uniform1f(stex, value)
      case 'VEC2':
        return this.gl.uniform2fv(stex, value)
      case 'VEC3':
        return this.gl.uniform3fv(stex, value)
      case 'VEC4':
        return this.gl.uniform4fv(stex, value)
      case 'MAT2':
        return this.gl.uniformMatrix2fv(stex, false, value)
      case 'MAT3':
        return this.gl.uniformMatrix3fv(stex, false, value)
      case 'MAT4':
        return this.gl.uniformMatrix4fv(stex, false, value)
      default:
        return
    }
  }
}
