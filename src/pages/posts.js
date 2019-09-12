import React from 'react'
import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'
import Link from '../components/TransitionLink'

export default ({ data }) => {
  return (
    <>
      <Helmet>
        <title>posts -Arthas.me</title>
      </Helmet>
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
