import Link from 'next/link'
import Head from 'next/head'

function About() {
  return <>
    <Head>
      <title>First Post</title>
    </Head>
    <h1>First Post</h1>
    <h2>
      <Link href="/">
        <a>Back to home</a>
      </Link>
    </h2>
  </>
}

export default About
