import Link from 'next/link'
import Head from 'next/head'
import { getDemos } from '../lib/api'


export default function Demos({ demos  }) {
  return (
    <>
      <Head>
        <title>Demos -Arthas.me</title>
      </Head>
      <h2>
        <Link href="/">
          <a>Arthas.me</a>
        </Link>
        {' / Demos'}
      </h2>
      <ul>
        {demos.map(d => (
          <li key={d.link}>
            <Link href={d.link}>
              <a>{d.title}</a>
            </Link>
            <span> {d.time}</span>
          </li>
        ))}
      </ul>
    </>
  )
}

export async function getStaticProps() {
  return {
    props: {
      demos: getDemos()
    }
  }
}
