import { demosList } from '@/data/demos'
import * as stylex from '@stylexjs/stylex'
import Link from 'next/link'
import { colors } from '../../tokens.stylex'

const styles = stylex.create({
  container: {
    margin: '0 auto',
    maxWidth: 960,
    padding: {
      'default': 24,
      '@media (min-width: 768px)': 32
    }
  },
  time: {
    color: colors.sage11,
    marginLeft: 8,
    fontSize: 14
  }
})

export default async function Demos() {
  return (
    <div {...stylex.props(styles.container)}>
      <h2>
        <Link href="/">Arthas.me</Link> / Demos
      </h2>
      <ul>
        {demosList.map((p, i) => {
          return (
            <li key={i}>
              <Link href={p.link} target="_blank">
                {p.title}
              </Link>
              <span {...stylex.props(styles.time)}>{p.time}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
