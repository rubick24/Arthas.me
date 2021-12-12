import Head from 'next/head'
import Link from 'next/link'

function About() {
  return (
    <>
      <Head>
        <title>About -Arthas.me</title>
      </Head>
      <h2>
        <Link href="/">
          <a>Arthas.me</a>
        </Link>
        {' / About'}
      </h2>
    </>
  )
}

export default About
