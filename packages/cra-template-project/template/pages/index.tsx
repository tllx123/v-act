import type { NextPage } from 'next'
import Head from 'next/head';
import Intro from "./intro/Index";
import styles from '../styles/Home.module.css'
import { setLanguage, useTranslation, getLanguages } from "@v-act/i18n"

const Home: NextPage = () => {
  const { t }  = useTranslation();
  const languages = getLanguages();
  return (
    <div className={styles.container}>
      <div className={styles.top}>
        {
          languages.map((language)=>{
            const code = language.getCode();
            return (<button key={code} className={styles.topbtn} onClick={()=>{setLanguage(code)}}>{t(code)}</button>)
          })
        }
      </div>
      <Head>
        <title>{t('title')}</title>
        <meta name="description" content="由create-v3-react-app创建" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Intro></Intro>
    </div>
  )
}

export default Home
