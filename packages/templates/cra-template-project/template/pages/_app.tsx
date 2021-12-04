import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { createTheme, ThemeProvider } from '@v-act/styles';

function MyApp({ Component, pageProps }: AppProps) {
  const theme = createTheme();
  return (
    <ThemeProvider theme = { theme }>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
export default MyApp
