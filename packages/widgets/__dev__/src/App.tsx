import { FC } from 'react'

import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'

import Button from './widgets/JGButton'

const App: FC = () => {
  // https://mui.com/customization/typography/#font-family
  const theme = createTheme({
    spacing: 4
  })
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div style={{ position: 'absolute', top: 16, left: 16 }}>
          <Button></Button>
        </div>
      </ThemeProvider>
    </>
  )
}

export default App
