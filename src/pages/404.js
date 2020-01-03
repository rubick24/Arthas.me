import React from "react"
import { Helmet } from 'react-helmet'
import Link from '../components/TransitionLink'
export default () => {
  return <>
    <Helmet>
      <title>404 -Arthas.me</title>
      <meta name="og:title" content="404 -Arthas.me" />
    </Helmet>
    <div>Page not found</div>
    <Link to='/'>Index</Link>
  </>
}
