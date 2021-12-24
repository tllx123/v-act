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
import { useContext } from '@v-act/widget-context'
import { toHeight, toWidth } from '@v-act/widget-utils'

export interface JGNewsListProps extends CardProps {
  title?: string
  bottom?: Property.Bottom
  height?: Property.Height
  left?: Property.Left
  right?: Property.Right
  top?: Property.Top
  width?: Property.Width
}

const JGNewsListRoot = styled(Card, {
  name: 'JGNewList',
  slot: 'Root',
  shouldForwardProp: (prop) => prop !== 'title'
})(({ theme }) => ({
  border: '1px solid #356abb'
}))

const JGNewsListToolbar = styled(Toolbar)(({ theme }) => ({
  height: 30,
  minHeight: 30,
  margin: theme.spacing(0, -2)
}))

const JGNewsList = forwardRef<HTMLDivElement, JGNewsListProps>(
  (inProps, ref) => {
    const context = useContext()
    const sx = inProps.sx || {}
    const props: JGNewsListProps = {
      sx: {
        ...sx,
        height: toHeight(inProps.height, context, '188px'),
        width: toWidth(inProps.width, context, '350px'),
        position: context ? context.position : 'absolute',
        bottom: inProps.bottom,
        left: inProps.left ?? 0,
        right: inProps.right,
        top: inProps.top ?? 0
      }
    }
    return (
      <JGNewsListRoot {...props} ref={ref}>
        <AppBar
          variant="outlined"
          elevation={0}
          position="static"
          sx={{ background: '#356abb' }}
        >
          <JGNewsListToolbar variant="dense">
            <Typography variant="body2">文本</Typography>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton edge="end" size="small" color="inherit">
              <MoreHoriz />
            </IconButton>
          </JGNewsListToolbar>
        </AppBar>
      </JGNewsListRoot>
    )
  }
)

JGNewsList.defaultProps = {
  height: '188px',
  width: '350px'
}

export default JGNewsList
