import '../styles/globals.css'
import 'antd/dist/antd.css'

import { useEffect } from 'react'
import App from 'next/app'
import { ServerStyleSheets } from '@material-ui/styles'
import { createTheme, ThemeProvider } from '@v-act/styles'

import PageManager from '../src/components/PageManager'

export default class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}

    const level = ctx.req ? 0 : parseInt(ctx.query.modal, 10) || 0

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps, level, url: ctx.asPath }
  }

  render() {
    const { Component, pageProps, level, url } = this.props
    const theme = createTheme()
    const page = <Component {...pageProps} />
    return (
      <ThemeProvider theme={theme}>
        <PageManager page={page} level={level} url={url} />
      </ThemeProvider>
    )
  }
}
