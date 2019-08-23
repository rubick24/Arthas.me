import React from 'react'
import { graphql, Link } from 'gatsby'
import Layout from '../components/Layout'

export default ({ data, location }) => {
  return (
    <Layout location={location}>
      <div>posts</div>
      {data.allMarkdownRemark.edges.map(({ node }) => (
        <div key={node.id}>
          <Link to={node.fields.slug}>
            <span>{node.frontmatter.title}</span>
          </Link>
        </div>
      ))}
    </Layout>
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
