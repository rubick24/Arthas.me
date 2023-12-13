import * as stylex from '@stylexjs/stylex'
import { colors } from './tokens.stylex'

const sage = {
  sage1: '#fbfdfc',
  sage2: '#f7f9f8',
  sage3: '#eef1f0',
  sage4: '#e6e9e8',
  sage5: '#dfe2e0',
  sage6: '#d7dad9',
  sage7: '#cbcfcd',
  sage8: '#b8bcba',
  sage9: '#868e8b',
  sage10: '#7c8481',
  sage11: '#5f6563',
  sage12: '#1a211e'
}

const teal = {
  teal1: '#fafefd',
  teal2: '#f3fbf9',
  teal3: '#e0f8f3',
  teal4: '#ccf3ea',
  teal5: '#b8eae0',
  teal6: '#a1ded2',
  teal7: '#83cdc1',
  teal8: '#53b9ab',
  teal9: '#12a594',
  teal10: '#0d9b8a',
  teal11: '#008573',
  teal12: '#0d3d38'
}

export const lightColors = stylex.createTheme(colors, {
  ...sage,
  ...teal
})
