import '../styles/global.css'
import '../styles/code.css'
import Head from 'next/head'
import Layout from '../components/layout'

export default function App({ Component, pageProps }) {
  return <Layout>
    <Head>
      <link rel="icon" type="image/png" href="/favicon.png" />
      <meta name="theme-color" content="#000000" />
      <meta name="theme-color" content="#000000" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css" integrity="sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X" crossorigin="anonymous"/>
    </Head>
    <Component {...pageProps} />
  </Layout>
}
