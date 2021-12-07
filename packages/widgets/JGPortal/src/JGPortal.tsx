import { forwardRef } from 'react'

import { Property } from 'csstype'

import {
  AppBar,
  Box,
  BoxProps,
  Card,
  Grid,
  styled,
  Toolbar,
  Typography
} from '@mui/material'

interface JGPortalProps extends BoxProps {
  bottom?: Property.Bottom
  height?: Property.Height
  left?: Property.Left
  right?: Property.Right
  top?: Property.Top
  width?: Property.Width
}

const JGPortalRoot = styled(Box, {
  name: 'JGPortal',
  slot: 'Root'
})(({ theme }) => ({
  position: 'relative'
}))

const JGPortal = forwardRef<HTMLDivElement, JGPortalProps>((inProps, ref) => {
  const props: BoxProps = {
    sx: {
      width: inProps.width,
      top: inProps.top,
      right: inProps.right,
      left: inProps.left,
      height: inProps.height,
      bottom: inProps.bottom
    }
  }

  const JGPortalWindow = styled(Card, {
    name: 'JGNewList',
    slot: 'Root',
    shouldForwardProp: (prop) => prop !== 'title'
  })(({ theme }) => ({
    height: '300px',
    border: '1px solid #356abb'
  }))

  const DefaultPanelToolbar = styled(Toolbar)(({ theme }) => ({
    height: 30,
    minHeight: 30,
    margin: theme.spacing(0, -2)
  }))

  const DefaultWindow = () => (
    <JGPortalWindow>
      <AppBar position="static">
        <DefaultPanelToolbar variant="dense">
          <Typography variant="body2">窗体</Typography>
        </DefaultPanelToolbar>
      </AppBar>
    </JGPortalWindow>
  )

  const DefaultPanels = () => (
    <Grid container spacing={2} direction="column">
      <Grid item container spacing={2} direction="row">
        <Grid item xs={6}>
          <DefaultWindow />
        </Grid>
        <Grid item xs={6}>
          <DefaultWindow />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <DefaultWindow />
      </Grid>
    </Grid>
  )

  return (
    <JGPortalRoot {...props} ref={ref}>
      {inProps.children ?? <DefaultPanels />}
    </JGPortalRoot>
  )
})

export default JGPortal
