import type { NextPage } from 'next'
import Head from 'next/head';
import Intro from "./intro/Index";
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>V平台React项目样例</title>
        <meta name="description" content="由create-v3-react-app创建" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Intro></Intro>
    </div>
  )
}

export default Home
