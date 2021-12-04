import type { NextPage } from 'next'
import Head from 'next/head';
import Intro from "./intro/Index";
import styles from '../styles/Home.module.css';
import { useTranslation } from "@v-act/i18n";
import { Theme, useTheme } from "@v-act/styles";
import Top from './components/Top';

declare module '@v-act/styles' {
  interface Theme {
    global: {
      /**
       * @namespace global
       * @title 全局背景
       * @value #282c34
       * @desc  全局背景
       */
      background: string
    }
    btn: {
      /**
       * @namespace btn
       * @title 按钮文字颜色
       * @value white
       * @desc 按钮文字颜色
       */
      color: string,
      /**
       * @namespace btn
       * @title 按钮背景色
       * @value #356abb
       * @desc 按钮背景色
       */
      bgcolor: string
    }
    text: {
      /**
       * @namespace text
       * @title 文字颜色
       * @value white
       * @desc 普通文字的颜色
       */
      color: string
    }
  }
}

const Home: NextPage = () => {

  //#region 多语言
  const { t } = useTranslation();
  //#endregion

  //#region 样式
  const theme: Theme = useTheme();
  const { global: { background } } = theme;
  //#endregion
  return (
    <div className={styles.container} style={{ background: background }}>
      <Top />
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
