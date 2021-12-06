import { FC } from 'react'

import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'

import Routes from './routes'

const App: FC = () => {
  // https://mui.com/customization/typography/#font-family
  const theme = createTheme({
    spacing: 4
  })
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes />
      </ThemeProvider>
    </>
  )
}

export default App
