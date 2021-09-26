import { remark } from 'remark'
import html from 'remark-html'
import math from 'remark-math'
import remark2rehype from 'remark-rehype'
import katex from 'rehype-katex'
import stringify from 'rehype-stringify'
import prism from 'remark-prism'

export default async function markdownToHtml(markdownStr) {
  const result = await remark()
    .use(prism)
    .use(html)
    .use(math)
    .use(remark2rehype, {allowDangerousHtml: true})
    .use(katex)
    .use(stringify, {allowDangerousHtml: true})
    .process(markdownStr)
  return result.toString()
}
