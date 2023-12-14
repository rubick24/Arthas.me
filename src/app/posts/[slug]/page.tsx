import { getPostBySlug, getPostSlugs } from '@/lib/api'
import { colors } from '../../../tokens.stylex'
import { Code } from 'bright'
import 'katex/dist/katex.min.css'
import Markdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import remarkMath from 'remark-math'
import * as stylex from '@stylexjs/stylex'
import { Metadata } from 'next'

export async function generateStaticParams() {
  return getPostSlugs()
}

type Props = { params: { slug: string; title: string; date: number } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const postData = await getPostBySlug(params.slug)
  return {
    title: postData.title
  }
}

const styles = stylex.create({
  base: {
    color: colors.sage12
  }
})

export default async function Page({ params }: Props) {
  const postData = await getPostBySlug(params.slug)
  const timeStr = (() => {
    const d = new Date(postData.date)
    return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`
  })()
  return (
    <article {...stylex.props(styles.base)}>
      <h1>{postData.title}</h1>
      <div>{timeStr}</div>
      <Markdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
        components={{
          pre: props => {
            return (
              <Code
                {...props}
                theme={{
                  dark: 'dark-plus',
                  light: 'light-plus'
                  // lightSelector: 'html.light'
                }}
              />
            )
          }
        }}
      >
        {postData.content}
      </Markdown>
    </article>
  )
}
