import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
// import { useGlobalStatus } from './store'

const StyledCanvas = styled.canvas`
  position: fixed;
  pointer-events: none;
  z-index: 100;
`

export default ({ location }) => {
  // const [gs, setGs] = useGlobalStatus()
  const canvasRef = useRef()
  const internalStatus = useRef({
    oldPath: '',
    path: '',
    t: 0
  })

  internalStatus.current.oldPath = internalStatus.current.path
  internalStatus.current.path = location.pathname
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
    // gl.enable(gl.DEPTH_TEST)
    // gl.enable(gl.CULL_FACE)

    gl.clearColor(0, 0, 0, 0)
    const renderLoop = time => {
      const s = internalStatus.current
      if (s.triggerAnimation) {
        s.triggerAnimation = false
        s.ct = time
      }
      if (time < s.ct + 1000) {
        // animation
      } 
      s.t += 1
      
      console.log(s.t, s.ct, s.path, s.oldPath)

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
      requestAnimationFrame(renderLoop)
    }
    renderLoop()
  }, [])

  return (
    <StyledCanvas ref={canvasRef}/>
  )
}
