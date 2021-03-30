import Head from 'next/head'
import { getDemos } from '../lib/api'


export default function Demos({ demos  }) {
  return (
    <>
      <Head>
        <title>Demos -Arthas.me</title>
      </Head>
      <ul>
        {demos.map(d => (
          <li key={d.link}>
            <a href={d.link} target="_blank">{d.title}</a>
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
