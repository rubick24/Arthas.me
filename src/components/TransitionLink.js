import React from "react"
import { navigate, prefetchPathname } from 'gatsby'
import styled from 'styled-components'
import { useGlobalStatus } from './store'

const LinkButton = styled.a`
  cursor: pointer;
`
export default ({ children, to }) => {
  const [gs, setGs] = useGlobalStatus()
  const handleClick = e => {
    e.preventDefault()
    prefetchPathname(to)
    setGs({...gs, prePath: to})
    setTimeout(() => navigate(to), 250)
  }
  return <LinkButton href={to} onClick={handleClick}>{children}</LinkButton>
}