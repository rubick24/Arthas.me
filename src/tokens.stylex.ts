import * as stylex from '@stylexjs/stylex'

// https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale

const sageDark = {
  sage1: '#101211',
  sage2: '#171918',
  sage3: '#202221',
  sage4: '#272a29',
  sage5: '#2e3130',
  sage6: '#373b39',
  sage7: '#444947',
  sage8: '#5b625f',
  sage9: '#63706b',
  sage10: '#717d79',
  sage11: '#adb5b2',
  sage12: '#eceeed'
}
const tealDark = {
  teal1: '#0d1514',
  teal2: '#111c1b',
  teal3: '#0d2d2a',
  teal4: '#023b37',
  teal5: '#084843',
  teal6: '#145750',
  teal7: '#1c6961',
  teal8: '#207e73',
  teal9: '#12a594',
  teal10: '#0eb39e',
  teal11: '#0bd8b6',
  teal12: '#adf0dd'
}

export const colors = stylex.defineVars({
  ...sageDark,
  ...tealDark
})
