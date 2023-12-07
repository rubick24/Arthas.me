import Image from 'next/image'

import * as stylex from '@stylexjs/stylex'

const styles = stylex.create({
  base: {
    fontSize: 32,
    lineHeight: 1.5,
    color: 'red'
  }
})

export default function Home() {
  return <div {...stylex.props(styles.base)}>123</div>
}
