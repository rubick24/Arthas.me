import React, { useState, useRef, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'
import CanvasLayer from './CanvasLayer'

const MainContainer = styled.div`
  padding-top: 24px;
  max-width: 980px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 1028px) {
    margin-left: 24px;
    margin-right: 24px;
  }
`

export default ({ children, location }) => {
  const [visiable, setVisiable] = useState(false)
  const path = useRef(location.pathname)
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
      <CanvasLayer location={location} />
      {shouldRender ? <MainContainer>{children}</MainContainer> : null}
    </>
  )
}
