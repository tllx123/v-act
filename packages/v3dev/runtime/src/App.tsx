import { FC, Suspense } from 'react'

import { CssBaseline, ThemeProvider } from '@mui/material'
import { createTheme } from '@v-act/vdev'

import { Routes } from './routes'

const App: FC = () => {
  return (
    <ThemeProvider theme={createTheme()}>
      <CssBaseline />
      <Suspense fallback={<div />}>
        <Routes />
      </Suspense>
    </ThemeProvider>
  )
}

export default App
