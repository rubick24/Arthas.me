import { colors } from '../tokens.stylex'
import * as stylex from '@stylexjs/stylex'

const styles = stylex.create({
  base: {
    fontSize: 32,
    lineHeight: 1.5,
    color: colors.sage12
  }
})

export default function Home() {
  return <div {...stylex.props(styles.base)}>foo</div>
}
