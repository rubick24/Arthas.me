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
    </Head>
    <Component {...pageProps} />
  </Layout>
}
