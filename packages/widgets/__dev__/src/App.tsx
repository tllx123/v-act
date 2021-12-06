import { FC } from 'react'

import { createTheme, ThemeProvider } from '@mui/material'

import Button from './widgets/JGButton'

const App: FC = () => {
  // https://mui.com/customization/typography/#font-family
  const theme = createTheme({
    typography: {}
  })
  return (
    <>
      <ThemeProvider theme={theme}>
        <Button></Button>
      </ThemeProvider>
    </>
  )
}

export default App
