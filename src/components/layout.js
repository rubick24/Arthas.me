import React, { useState, useRef, useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'
import CanvasLayer from './CanvasLayer'

const MainContainer = styled.div`
  padding: 2.625rem 1.3125rem;
  max-width: 48rem;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 48rem) {
    & .code {
      margin-left: -1.3125rem;
      margin-right: -1.3125rem;
      border-radius: 0;
    }
  }
`

export default ({ children, location }) => {
  const [visiable, setVisiable] = useState(false)
  const path = useRef(location.pathname)
  const canvasLayer = useMemo(() => <CanvasLayer path={location.pathname} />, [location.pathname])
  useEffect(() => {
    if (path.current !== location.pathname) {
      path.current = location.pathname
      setVisiable(false)
    }
    const renderTimeout = setTimeout(() => setVisiable(true), 500)
    return () => clearTimeout(renderTimeout)
  }, [location.pathname])
  const shouldRender =
    path.current === location.pathname &&
    (visiable || typeof window === `undefined`)
  return (
    <>
      <Helmet>
        <link
          href="https://fonts.googleapis.com/css?family=Fira+Code|Fira+Sans&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      {canvasLayer}
      {shouldRender ? <MainContainer>{children}</MainContainer> : null}
    </>
  )
}
