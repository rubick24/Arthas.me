import React from 'react'
import { graphql } from 'gatsby'
import styled from 'styled-components'
import Link from '../components/TransitionLink'
import SEO from '../components/SEO'

const Hr = styled.hr`
  border: none;
  height: 1px;
  background: #ddd;
  margin: 24px 0px;
`

const BottomNavSec = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
const ContentWarpper = styled.div`
  & img {
    display: block;
    margin: 0 auto;
  }
`

export default ({ data, pageContext }) => {
  const { previous, next, slug } = pageContext
  const post = data.markdownRemark
  return (
    <>
      <SEO
        title={post.frontmatter.title}
        pathname={slug}
        article
      />
      <Link to='/posts'>返回</Link>
      <h1>{post.frontmatter.title}</h1>
      <p>Published at {post.frontmatter.date}</p>
      <ContentWarpper dangerouslySetInnerHTML={{ __html: post.html }} />
      <Hr />
      <BottomNavSec>
        {previous ? <Link to={previous.fields.slug}>{previous.frontmatter.title}</Link> : ' '}
        {next ? <Link to={next.fields.slug}>{next.frontmatter.title}</Link> : ' '}
      </BottomNavSec>
    </>
  )
}

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        date(formatString: "DD MMMM, YYYY")
      }
    }
  }
`
