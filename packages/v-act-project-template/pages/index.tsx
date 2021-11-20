import type { NextPage } from 'next'
import Head from 'next/head';
import Intro from "./intro/Index";
import styles from '../styles/Home.module.css'
import { createTheme, ThemeProvider } from '@v-act/styles';

const theme = createTheme();

const Home: NextPage = () => {
  return (
    <ThemeProvider theme={theme}>
      <div className={styles.container}>
        <Head>
          <title>VAct项目样例</title>
          <meta name="description" content="由create-react-app创建" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Intro></Intro>
      </div>
    </ThemeProvider>
  )
}

export default Home
