import React, { useRef, useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'
import CanvasLayer from './CanvasLayer'
import { useGlobalStatus } from './store'

const MainContainer = styled.main`
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
  const [gs, setGs] = useGlobalStatus()
  const path = useRef(location.pathname)
  const canvasLayer = useMemo(() => <CanvasLayer path={location.pathname} />, [
    location.pathname
  ])

  useEffect(() => {
    if (path.current !== location.pathname) {
      path.current = location.pathname
    }
    if (window.matchMedia) {
      const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')
      const handleModeChange = e => {
        if (gs.darkMode !== e.matches) {
          setGs({ ...gs, darkMode: e.matches })
        }
        if (e.matches) {
          document.body.style.backgroundColor = '#333333'
          document.body.style.color = '#d8dbd8'
        } else {
          document.body.style.backgroundColor = 'unset'
          document.body.style.color = 'unset'
        }
      }
      mediaQueryList.addListener(handleModeChange)
      handleModeChange(mediaQueryList)
    }
  }, [location.pathname, gs, setGs])
  return (
    <>
      <Helmet>
        <title>Arthas.me</title>
        <meta name="Description" content="random shits" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@deadalusmask" />
        <meta name="twitter:creator" content="@deadalusmask" />
        <meta name="og:title" content="Arthas.me" />
        <meta name="og:type" content="website" />
        <meta name="og:image" content={`${location.host}/static/favicon.png`} />
        <meta name="og:url" content={location.host + location.pathname} />
        
        <link
          href="https://fonts.googleapis.com/css?family=Fira+Code|Fira+Sans&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      {canvasLayer}
      <MainContainer className={gs.darkMode ? 'dark-mode' : ''}>
        {children}
      </MainContainer>
    </>
  )
}
