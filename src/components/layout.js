import React from 'react'
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
