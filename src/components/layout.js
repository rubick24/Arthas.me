import React from 'react'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'
import CanvasLayer from './CanvasLayer'

const MainContainer = styled.div`
  max-width: 980px;
  margin-left: auto;
  margin-right: auto;
`

export default ({ children, location }) => {
  return (
    <>
      <Helmet>
        <link
          href="https://fonts.googleapis.com/css?family=Fira+Code|Fira+Sans|Noto+Sans+SC&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <CanvasLayer location={location} />
      <MainContainer>{children}</MainContainer>
    </>
  )
}
