import React from "react"
import Link from '../components/TransitionLink'
import SEO from "../components/SEO"
export default () => {
  return <>
    <SEO title="404" />
    <div>Page not found</div>
    <Link to='/'>Index</Link>
  </>
}
