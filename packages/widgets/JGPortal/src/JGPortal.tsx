import { forwardRef } from 'react'

import { Property } from 'csstype'

import AppBar from '@mui/material/AppBar'
import Card, { CardProps } from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useContext } from '@v-act/widget-context'
import { toHeight, toWidth } from '@v-act/widget-utils'

export interface JGPortalProps extends CardProps {
  bottom?: Property.Bottom
  height?: Property.Height
  left?: Property.Left
  right?: Property.Right
  top?: Property.Top
  width?: Property.Width
}

const JGPortalRoot = styled(Card, {
  name: 'JGPortal',
  slot: 'Root'
})(({ theme }) => ({}))

const JGPortal = forwardRef<HTMLDivElement, JGPortalProps>((inProps, ref) => {
  const context = useContext()
  const sx = inProps.sx || {}
  const props: JGPortalProps = {
    sx: {
      ...sx,
      height: toHeight(inProps.height, context, '724px'),
      width: toWidth(inProps.width, context, '1200px'),
      position: context ? context.position : 'absolute',
      top: inProps.top,
      right: inProps.right,
      left: inProps.left,
      bottom: inProps.bottom
    }
  }

  const JGPortalWindow = styled(Card, {
    name: 'JGPortalWindow',
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

JGPortal.defaultProps = {
  height: '724px',
  width: '1200px'
}

export default JGPortal
