import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Link from 'next/link'
import Head from 'next/head'
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

  return <>
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
    </Head>
    <h3>
      <Link href="/"><a>Arthas.me</a></Link>
      {' / '}
      <Link href="/posts"><a>Posts</a></Link>
      {' /'}
    </h3>
    <h1>{post.title}</h1>
    <span>{timeStr}</span>
    <div className="md-content" dangerouslySetInnerHTML={{__html: post.content}}></div>
    <hr className="hr"/>
    <div style={{display: 'flex', justifyContent: 'space-between'}}>
      {prev ? <Link href={`/posts/${prev.slug}`}><a style={{marginRight: '24px'}}>{prev.title}</a></Link> : <a></a>}
      {next ? <Link href={`/posts/${next.slug}`}><a>{next.title}</a></Link> : <a></a>}
    </div>
  </>
}

export async function getStaticProps({ params }) {
  const post = await getPostBySlug(params.slug, [
    'title',
    'date',
    'slug',
    'content',
  ])
  if (!post) {
    return {}
  }
  const posts = await getAllPosts(['slug', 'title'])
  const index = posts.findIndex(v => v.slug === params.slug)
  
  return {
    props: {
      post,
      prev: index + 1 < posts.length ? posts[index + 1] : null,
      next: index - 1 >= 0 ? posts[index - 1] : null,
    },
  }
}

export async function getStaticPaths() {
  const posts = await getAllPosts(['slug'])

  return {
    paths: posts.map(post => {
      return {
        params: {
          slug: post.slug,
        },
      }
    }),
    fallback: false,
  }
}
