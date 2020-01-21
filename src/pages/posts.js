import React from 'react'
import { graphql } from 'gatsby'
import Link from '../components/TransitionLink'
import SEO from '../components/SEO'

export default ({ data }) => {
  return (
    <>
      <SEO title="posts" />
      <Link to='/'>Index</Link>
      <div>posts</div>
      {data.allMarkdownRemark.edges.map(({ node }) => (
        <div key={node.id}>
          <Link to={node.fields.slug}>
            <span>{node.frontmatter.title}</span>
          </Link>
        </div>
      ))}
    </>
  )
}
export const query = graphql`
  query {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
          }
          fields {
            slug
          }
          excerpt
        }
      }
    }
  }
`
