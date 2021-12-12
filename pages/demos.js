import Head from 'next/head'
import Link from 'next/link'
import { getDemos } from '../lib/api'

export default function Demos({ demos }) {
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
            <a href={d.link} target="_blank">
              {d.title}
            </a>
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
