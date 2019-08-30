import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
// import { useGlobalStatus } from './store'
import Shader from './shader'
import vsSource from 'raw-loader!./shader/main.vert'
import fsSource from 'raw-loader!./shader/main.frag'

const StyledCanvas = styled.canvas`
  position: fixed;
  pointer-events: none;
  z-index: 100;
`

export default ({ path }) => {
  // const [gs, setGs] = useGlobalStatus()
  const canvasRef = useRef()
  const internalStatus = useRef({
    oldPath: '',
    path: '',
    t: 0
  })

  internalStatus.current.oldPath = internalStatus.current.path
  internalStatus.current.path = path
  internalStatus.current.triggerAnimation = true
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth
    const gl = canvas.getContext('webgl2', { premultipliedAlpha: false })
    if (!gl) {
      return
    }
    gl.viewport(0, 0, canvas.width, canvas.height)
    // gl.enable(gl.DEPTH_TEST)
    // gl.enable(gl.CULL_FACE)
    const shader = new Shader(gl, vsSource, fsSource)
    shader.use()
    const quad = [-1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, -1.0]
    const quadVAO = gl.createVertexArray()
    const quadVBO = gl.createBuffer()
    gl.bindVertexArray(quadVAO)
    gl.bindBuffer(gl.ARRAY_BUFFER, quadVBO)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(quad), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, true, 8, 0)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    gl.bindVertexArray(null)
    shader.setUniform('iResolution', 'VEC2', [
      canvas.clientWidth,
      canvas.clientHeight
    ])

    // track mouse position for uniform
    const handleGlobalClick = e => {
      shader.setUniform('iMouse', 'VEC2', [
        e.clientX,
        e.clientY
      ])
    }
    window.addEventListener('click', handleGlobalClick)

    gl.clearColor(0, 0, 0, 0)
    const renderLoop = time => {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
      if (window.innerHeight !== canvas.height || window.innerWidth !== canvas.width) {
        canvas.height = window.innerHeight
        canvas.width = window.innerWidth
        gl.viewport(0, 0, canvas.width, canvas.height)
      }
      shader.use()
      shader.setUniform('iTime', 'FLOAT', time)

      const s = internalStatus.current
      
      if (s.triggerAnimation) {
        s.triggerAnimation = false
        s.ct = time
        shader.setUniform('uAnimationStart', 'FLOAT', time)
      }
      if (time < s.ct + 500) {
        // animation
      }
      
      gl.bindVertexArray(quadVAO)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      requestAnimationFrame(renderLoop)
    }
    renderLoop(0)
  }, [])

  return <StyledCanvas ref={canvasRef} />
}
