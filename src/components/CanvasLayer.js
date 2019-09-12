import React, { useState, useEffect, useRef, useMemo } from 'react'
import styled from 'styled-components'
import { useGlobalStatus } from './store'
import Shader from './shader'
import vsSource from 'raw-loader!./shader/main.vert'
import fsSource from 'raw-loader!./shader/main.frag'

import utSource from '../assets/ut.mp3'

const StyledCanvas = styled.canvas`
  position: fixed;
  pointer-events: none;
  z-index: 100;
`

const FixedButton = styled.button`
  position: fixed;
  right: 0;
  outline: none;
  background: none;
  border: none;
  padding: 0;
  &::before {
    cursor: pointer;
    font-size: 24px;
    line-height: 1.3;
  }
`
const PlayButton = styled(FixedButton)`
  bottom: 0;
  &::before {
    content: ${props => props.playing ? '"⏸"' : '"▶️"'};
  }
`

const BackToTopButton = styled(FixedButton)`
  bottom: 32px;
  &::before {
    content: "🔝";
  }
`

export default ({ path }) => {
  const gs = useGlobalStatus()[0]
  const [playing, setPlaying] = useState(false)
  const canvasRef = useRef()
  const internalStatus = useRef({
    oldPath: '',
    path: '',
    audio: null
  })
  if (gs.prePath !== path && gs.prePath) {
    // console.log(internalStatus.current.oldPath, '#', internalStatus.current.path, gs.prePath, path)
    internalStatus.current.oldPath = internalStatus.current.path
    internalStatus.current.triggerAnimation = true
    // forward or backward
    internalStatus.current.path = internalStatus.current.path === path ? gs.prePath : path
  }

  const togglePlaying = () => {
    const { audio, audioContext } = internalStatus.current
    if (!audio) {
      return
    }
    if (audio.paused) {
      audio.play().then(() => {
        setPlaying(true)
        if (audioContext.state === 'suspended') {
          audioContext.resume()
        }
      }).catch(e => {
        console.warn(e.message)
      })
    } else {
      audio.pause()
      setPlaying(false)
    } 
  }

  useEffect(() => {
    const audioContext = new AudioContext()
    const audio = document.createElement('audio')
    audio.src = utSource
    internalStatus.current = {
      ...internalStatus.current,
      audioContext,
      audio
    }

    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 1024
    const frequencyData = new Float32Array(analyser.frequencyBinCount)

    const source = audioContext.createMediaElementSource(audio)
    source.connect(analyser)
    analyser.connect(audioContext.destination)

    audio.play().then(() => {
      setPlaying(true)
    }).catch(e => {
      console.warn(e.message)
    })

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
    // gl.bindVertexArray(null)
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

    // uniform buffer
    const uniformBlockIndex = gl.getUniformBlockIndex(shader.program, 'Block')
    const ubuffer = gl.createBuffer()
    gl.bindBuffer(gl.UNIFORM_BUFFER, ubuffer)
    const uniformBufferIndex = 0
    gl.uniformBlockBinding(shader.program, uniformBlockIndex, uniformBufferIndex)
    gl.bindBufferBase(gl.UNIFORM_BUFFER, uniformBufferIndex, ubuffer)

    gl.clearColor(0, 0, 0, 0)
    const renderLoop = time => {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
      if (window.innerHeight !== canvas.height || window.innerWidth !== canvas.width) {
        canvas.height = window.innerHeight
        canvas.width = window.innerWidth
        shader.setUniform('iResolution', 'VEC2', [
          canvas.clientWidth,
          canvas.clientHeight
        ])
        gl.viewport(0, 0, canvas.width, canvas.height)
      }
      shader.setUniform('iTime', 'FLOAT', time)

      analyser.getFloatFrequencyData(frequencyData) // byteLength: 512 * 4
      gl.bufferData(gl.UNIFORM_BUFFER, frequencyData, gl.DYNAMIC_DRAW)

      const s = internalStatus.current

      if (s.triggerAnimation) {
        s.triggerAnimation = false
        shader.setUniform('uAnimationStart', 'FLOAT', time)
      }
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      requestAnimationFrame(renderLoop)
    }
    renderLoop(0)
  }, [])

  const canvas = useMemo(() => <StyledCanvas ref={canvasRef} />, [])

  const [atTop, setAtTop] = useState(true)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY !== 0) {
        setAtTop(false)
      } else {
        setAtTop(true)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  })
  const handleBackToTop = () => window.scrollTo({top: 0, behavior: 'smooth'})
  
  return <>
    {atTop ? null : <BackToTopButton onClick={handleBackToTop} />}
    <PlayButton aria-label='play/pause' playing={playing} onClick={togglePlaying} />
    {canvas}
  </>
}
