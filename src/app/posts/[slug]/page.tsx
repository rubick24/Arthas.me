import { getPostBySlug, getPostSlugs } from '@/lib/api'
import * as stylex from '@stylexjs/stylex'
import { Code } from 'bright'
import 'katex/dist/katex.min.css'
import { Metadata } from 'next'
import Link from 'next/link'
import Markdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import remarkMath from 'remark-math'
import { colors } from '../../../tokens.stylex'
import { openGraph, twitter } from '../../shared-metadata'

export async function generateStaticParams() {
  return getPostSlugs()
}

type Props = { params: { slug: string; title: string; date: number } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const postData = await getPostBySlug(params.slug)
  return {
    title: postData.title,
    openGraph: {
      ...openGraph,
      type: 'article',
      authors: ['Rubick'],
      publishedTime: new Date(postData.date).toISOString()
    },
    twitter: {
      ...twitter,
      title: postData.title
    }
  }
}

const styles = stylex.create({
  base: {
    color: colors.sage12,
    margin: '0 auto',
    maxWidth: 960,
    padding: {
      'default': 24,
      '@media (min-width: 768px)': 32
    }
  },
  title: {
    fontSize: 32
  },
  time: {
    fontSize: 16,
    color: colors.sage11,
    marginBottom: 16
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
      <h2>
        <Link href="/">Arthas.me</Link> / <Link href="/posts">Posts</Link>
      </h2>
      <h1 {...stylex.props(styles.title)}>{postData.title}</h1>
      <div {...stylex.props(styles.time)}>{timeStr}</div>
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
