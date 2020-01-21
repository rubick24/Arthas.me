import React from "react"
import Link from '../components/TransitionLink'
import SEO from '../components/SEO'

export default () => {
  return <>
    <SEO />
    <div>index page</div>
    <Link to='/posts'>Posts</Link>
  </>
}
