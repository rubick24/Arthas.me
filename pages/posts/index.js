import Link from 'next/link'
import Head from 'next/head'
import { getAllPosts } from '../../lib/api'

export default function Posts({ posts }) {
  return <>
    <Head>
      <title>Posts -Arthas.me</title>
    </Head>
    <h2>
      <Link href="/">
        <a>Arthas.me</a>
      </Link>
      {' / Posts'}
    </h2>
    <ul>
      {
        posts.map(post => <li key={post.slug}>
          <Link href={`/posts/${post.slug}`}>
            <a>{post.title}</a>
          </Link>
        </li>)
      }
    </ul>
  </>
}
export async function getStaticProps() {
  const posts = await getAllPosts(['slug', 'title', 'date'])
  return {
    props: { posts },
  }
}