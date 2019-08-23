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
  // const internalStatus = useRef({
  //   t: 0
  // })
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth
    const gl = canvas.getContext('webgl')
    if (!gl) {
      return
    }
    // gl.enable(gl.DEPTH_TEST)
    // gl.enable(gl.CULL_FACE)

    gl.clearColor(0, 0, 0, 0)
    const renderLoop = () => {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
      requestAnimationFrame(renderLoop)
    }
    renderLoop()
    
    console.log(location.pathname)
  }, [])

  return (
    <StyledCanvas ref={canvasRef}/>
  )
}
