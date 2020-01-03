import React from "react"
import { Helmet } from 'react-helmet'
import Link from '../components/TransitionLink'
export default () => {
  return <>
    <Helmet>
      <title>Arthas.me</title>
    </Helmet>
    <div>index page</div>
    <Link to='/posts'>Posts</Link>
  </>
}
