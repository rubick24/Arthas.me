import React from 'react'
import { Helmet } from 'react-helmet'

export default ({ children }) => {
  return (
    <>
      <Helmet>
        <link
          href="https://fonts.googleapis.com/css?family=Fira+Code|Fira+Sans|Noto+Sans+SC&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <main>{children}</main>
    </>
  )
}
