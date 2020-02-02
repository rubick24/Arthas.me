import React, { useState, useEffect, useRef, useMemo } from 'react'
import styled from 'styled-components'
import { useGlobalStatus } from './store'
import Shader from './shader'
import vsSource from 'raw-loader!./shader/main.vert'
import fsSource from 'raw-loader!./shader/main.frag'
import tracks from '../assets/wotw.json'

const PI2 = Math.PI * 2
const keyToFrequency = n => Math.pow(2, (n - 49) / 12) * 440
const generateAudioSignal = (frequency, duration, time) => {
  let w = frequency * PI2
  const t = time / duration
  const shape = -0.25 * Math.sin(time * w * 3) + 0.25 * Math.sin(time * w) + (Math.sqrt(3) / 2) * Math.cos(time * w)
  const volume = (Math.cos(t * Math.PI) + 1) / 2 // Math.exp(-3 * t)
  return shape * volume
}
const sampleRate = 48000
let started = false
let startAt = Number.MAX_SAFE_INTEGER
const start = async (audioCtx, dist, shader) => {
  started = true

  // const tracks = await fetch('/wotw.json').then(res => res.json())
  setTimeout(() => {
    startAt = audioCtx.currentTime
    shader.setUniform('uAudioStartAt', 'FLOAT', startAt)
    tracks.forEach(notes => {
      notes.forEach(note => {
        note.source = audioCtx.createBufferSource()
        const noteBufferData = new Float32Array(sampleRate * note.duration)
        const frameCount = sampleRate * note.duration
        for (let frame = 0; frame < frameCount; frame += 1) {
          const time = frame / sampleRate
          const f = keyToFrequency(note.midi - 20)
          noteBufferData[frame] = generateAudioSignal(f, note.duration, time)
        }
        note.source.buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 3, audioCtx.sampleRate)
        note.source.buffer.copyToChannel(noteBufferData, 0, 0)
        note.source.connect(dist)
        note.source.start(startAt + note.time)
      })
    })
  }, 50)
}

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
  bottom: 32px;
  &::before {
    content: ${props => (props.playing ? '"⏸"' : '"▶️"')};
  }
`

const BackToTopButton = styled(FixedButton)`
  bottom: 64px;
  &::before {
    content: '🔝';
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
  if (gs.prePath && gs.prePath !== path) {
    internalStatus.current.oldPath = internalStatus.current.path
    internalStatus.current.triggerAnimation = true
    // forward or backward
    internalStatus.current.path = internalStatus.current.path === path ? gs.prePath : path
  }
  if (internalStatus.current.darkMode !== gs.darkMode) {
    internalStatus.current.darkMode = gs.darkMode
    internalStatus.current.shader.setUniform('uDarkMode', 'BOOLEAN', gs.darkMode)
  }

  const togglePlaying = () => {
    const { audioCtx, compressor, shader } = internalStatus.current
    if (audioCtx.state === 'suspended') {
      if (!started) {
        start(audioCtx, compressor, shader)
      } else {
        audioCtx.resume()
      }
      setPlaying(true)
    } else {
      if (!started) {
        start(audioCtx, compressor, shader)
        setPlaying(true)
      } else if (audioCtx.currentTime - startAt > 112) {
        start(audioCtx, compressor, shader)
        setPlaying(true)
      } else {
        audioCtx.suspend()
        setPlaying(false)
      }
    }
  }

  useEffect(() => {
    const audioCtx = new AudioContext({ sampleRate })
    const compressor = audioCtx.createDynamicsCompressor()
    // const analyser = audioCtx.createAnalyser()
    // analyser.fftSize = 1024
    // const frequencyData = new Float32Array(analyser.frequencyBinCount)
    const gainNode = audioCtx.createGain()
    gainNode.gain.setValueAtTime(0.2, 0)

    // compressor.connect(analyser)
    // analyser.connect(gainNode)
    compressor.connect(gainNode)
    gainNode.connect(audioCtx.destination)

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
    shader.setUniform('uResolution', 'VEC2', [canvas.clientWidth, canvas.clientHeight])

    // track mouse position for uniform
    const handleGlobalClick = e => {
      shader.setUniform('uMouse', 'VEC2', [e.clientX, e.clientY])
    }
    window.addEventListener('click', handleGlobalClick)

    // uniform buffer
    const uniformBlockIndex = gl.getUniformBlockIndex(shader.program, 'Audio')
    const ubuffer = gl.createBuffer()
    gl.bindBuffer(gl.UNIFORM_BUFFER, ubuffer)
    const uniformBufferIndex = 0
    gl.uniformBlockBinding(shader.program, uniformBlockIndex, uniformBufferIndex)
    gl.bindBufferBase(gl.UNIFORM_BUFFER, uniformBufferIndex, ubuffer)

    const dataArr = new Float32Array((tracks[0].length + tracks[1].length) * 4)
    for (let i = 0; i < tracks[0].length; i++) {
      dataArr[i * 4] = tracks[0][i].midi
      dataArr[i * 4 + 1] = tracks[0][i].time
      dataArr[i * 4 + 2] = tracks[0][i].duration
    }
    for (let i = 0; i < tracks[1].length; i++) {
      dataArr[tracks[0].length * 4 + i * 4] = tracks[1][i].midi
      dataArr[tracks[0].length * 4 + i * 4 + 1] = tracks[1][i].time
      dataArr[tracks[0].length * 4 + i * 4 + 2] = tracks[1][i].duration
    }
    gl.bufferData(gl.UNIFORM_BUFFER, dataArr, gl.STATIC_DRAW)
    internalStatus.current = {
      ...internalStatus.current,
      audioCtx,
      compressor,
      gl,
      shader
    }

    gl.clearColor(0, 0, 0, 0)
    shader.setUniform('uAudioStartAt', 'FLOAT', startAt)
    const renderLoop = time => {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
      if (window.innerHeight !== canvas.height || window.innerWidth !== canvas.width) {
        canvas.height = window.innerHeight
        canvas.width = window.innerWidth
        shader.setUniform('uResolution', 'VEC2', [canvas.clientWidth, canvas.clientHeight])
        gl.viewport(0, 0, canvas.width, canvas.height)
      }
      shader.setUniform('uTime', 'FLOAT', time)
      shader.setUniform('uAudioCurrentTime', 'FLOAT', audioCtx.currentTime)
      // analyser.getFloatFrequencyData(frequencyData) // byteLength: 512 * 4
      // gl.bufferData(gl.UNIFORM_BUFFER, frequencyData, gl.DYNAMIC_DRAW)

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
  const handleBackToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <>
      {atTop ? null : <BackToTopButton onClick={handleBackToTop} />}
      <PlayButton aria-label={playing ? 'pause' : 'play'} playing={playing} onClick={togglePlaying} />
      {canvas}
    </>
  )
}
