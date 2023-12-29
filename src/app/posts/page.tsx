import { getAllPosts } from '@/lib/api'
import * as stylex from '@stylexjs/stylex'
import Link from 'next/link'

const styles = stylex.create({
  container: {
    margin: '0 auto',
    maxWidth: 960,
    padding: {
      'default': 24,
      '@media (min-width: 768px)': 32
    }
  }
})

export default async function Posts() {
  const postList = await getAllPosts()
  return (
    <div {...stylex.props(styles.container)}>
      <h2>
        <Link href="/">Arthas.me</Link> / Posts
      </h2>
      <ul>
        {postList.map(p => {
          return (
            <li key={p.slug}>
              <Link href={`/posts/${p.slug}`}>{p.title}</Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
