import { FC, Suspense } from 'react'

import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'

import Routes from './routes'

const App: FC = () => {
  const theme = createTheme({
    spacing: 4,
    vact: {} as any
  })
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Suspense fallback={<div />}>
          <Routes />
        </Suspense>
      </ThemeProvider>
    </>
  )
}

export default App
