import { forwardRef } from 'react'

import { Property } from 'csstype'

import { MoreHoriz } from '@mui/icons-material'
import {
  AppBar,
  Box,
  Card,
  CardProps,
  IconButton,
  styled,
  Toolbar,
  Typography
} from '@mui/material'

interface JGNewListProps extends CardProps {
  title?: string
  bottom?: Property.Bottom
  height?: Property.Height
  left?: Property.Left
  right?: Property.Right
  top?: Property.Top
  width?: Property.Width
}

const JGNewListRoot = styled(Card, {
  name: 'JGNewList',
  slot: 'Root',
  shouldForwardProp: (prop) => prop !== 'title'
})(({ theme }) => ({
  position: 'absolute',
  border: '1px solid #356abb'
}))

const JGNewListToolbar = styled(Toolbar)(({ theme }) => ({
  height: 30,
  minHeight: 30,
  margin: theme.spacing(0, -2)
}))

const JGNewList = forwardRef<HTMLDivElement, JGNewListProps>((inProps, ref) => {
  const props: JGNewListProps = {
    sx: {
      bottom: inProps.bottom,
      height: inProps.height,
      left: inProps.left ?? 0,
      right: inProps.right,
      top: inProps.top ?? 0,
      width: inProps.width
    }
  }
  return (
    <JGNewListRoot {...props} ref={ref}>
      <AppBar
        variant="outlined"
        elevation={0}
        position="static"
        sx={{ background: '#356abb' }}
      >
        <JGNewListToolbar variant="dense">
          <Typography variant="body2">文本</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton edge="end" size="small" color="inherit">
            <MoreHoriz />
          </IconButton>
        </JGNewListToolbar>
      </AppBar>
    </JGNewListRoot>
  )
})

export default JGNewList
