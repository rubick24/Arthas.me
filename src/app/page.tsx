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

export default function Home() {
  return (
    <div {...stylex.props(styles.container)}>
      <h1>Arthas.me</h1>
      <ul>
        <li>
          <Link href="/posts">Posts</Link>
        </li>
        <li>
          <Link href="/demos">Demos</Link>
        </li>
      </ul>
    </div>
  )
}
