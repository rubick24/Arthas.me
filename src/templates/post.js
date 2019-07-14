import React from 'react'
import { graphql, Link } from 'gatsby'
import Layout from '../components/layout'
import styled from 'styled-components'

const StyledContent = styled.div`
  code {
    /* color: #476582;
    padding: 0.25rem 0.5rem;
    margin: 0;
    font-size: 0.85em;
    background-color: rgba(27, 31, 35, 0.05);
    border-radius: 3px; */
  }
`
export default ({ data, pageContext }) => {
  const { previous, next } = pageContext
  const post = data.markdownRemark
  return (
    <Layout>
      <h1>{post.frontmatter.title}</h1>
      <p>Published at {post.frontmatter.date}</p>
      <StyledContent dangerouslySetInnerHTML={{ __html: post.html }} />
      <hr />
      <div>
        <Link to={previous.fields.slug}>{previous.frontmatter.title}</Link>{' '}
        <Link to={next.fields.slug}>{next.frontmatter.title}</Link>
      </div>
    </Layout>
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
