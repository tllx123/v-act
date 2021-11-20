import type { NextPage } from 'next';
import Head from 'next/head';
{@if componentCode&&windowCode}
import Index from "./${componentCode}/${windowCode}/index";
{@/if}
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>VAct项目热更新样例</title>
        <meta name="description" content="由create-react-app创建" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {@if componentCode&&windowCode}
      <Index></Index>
      ${@/if}
    </div>
  )
};

export default Home;
