import Link from 'next/link'
import Head from 'next/head'

export default function Index() {
  return <>
    <Head>
      <title>Arthas.me</title>
    </Head>
    <p>
      <Link href={`/posts`}><a>Posts</a></Link>
    </p>
    <p>
      <Link href={`/demos`}><a>Demos</a></Link>
    </p>
  </>
}
