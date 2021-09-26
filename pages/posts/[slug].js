import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Link from 'next/link'
import Head from 'next/head'
import { DiscussionEmbed } from 'disqus-react'
import { getPostBySlug, getAllPosts } from '../../lib/api'

export default function Post({ post, prev, next }) {
  const router = useRouter()
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }
  const timeStr = (() => {
    const d = new Date(post.date)
    return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`
  })()

  return (
    <>
      <Head>
        <meta name="image" content="/favicon.png" />
        <title>{post.title} -Arthas.me</title>
        {/* <meta name="description" content="random shits" /> */}

        <meta property="og:url" content={`https://arthas.me/posts/${post.slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:image" content="/favicon.png" />
        {/* <meta property="og:description" content="random shits" /> */}

        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="/favicon.png" />
        <meta name="twitter:creator" content="@deadalusmask" />
        {/* <meta name="twitter:description" content="random shits" /> */}

        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css"
          integrity="sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X"
          crossOrigin="anonymous"
        />
      </Head>
      <h1>{post.title}</h1>
      <span>{timeStr}</span>
      <div className="md-content" dangerouslySetInnerHTML={{ __html: post.content }}></div>
      <hr className="hr" />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        {prev ? (
          <Link href={`/posts/${prev.slug}`}>
            <a style={{ marginRight: '24px' }}>{prev.title}</a>
          </Link>
        ) : (
          <a></a>
        )}
        {next ? (
          <Link href={`/posts/${next.slug}`}>
            <a>{next.title}</a>
          </Link>
        ) : (
          <a></a>
        )}
      </div>

      <DiscussionEmbed
        shortname="arthas-me"
        config={{
          url: `https://arthas.me/posts/${post.slug}`,
          identifier: post.slug,
          title: post.title
        }}
      />
    </>
  )
}

export async function getStaticProps({ params }) {
  const post = await getPostBySlug(params.slug, ['title', 'date', 'slug', 'content'])
  if (!post) {
    return {}
  }
  const posts = await getAllPosts(['slug', 'title'])
  const index = posts.findIndex(v => v.slug === params.slug)

  return {
    props: {
      post,
      prev: index + 1 < posts.length ? posts[index + 1] : null,
      next: index - 1 >= 0 ? posts[index - 1] : null
    }
  }
}

export async function getStaticPaths() {
  const posts = await getAllPosts(['slug'])

  return {
    paths: posts.map(post => {
      return {
        params: {
          slug: post.slug
        }
      }
    }),
    fallback: false
  }
}
