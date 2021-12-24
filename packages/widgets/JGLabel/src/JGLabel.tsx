import { forwardRef } from 'react'

import { Property } from 'csstype'

import { styled, Typography, TypographyProps } from '@mui/material'
import { useContext } from '@v-act/widget-context'
import { toHeight, toWidth } from '@v-act/widget-utils'

export interface JGLabelProps extends TypographyProps {
  bottom?: Property.Bottom
  height?: Property.Height
  left?: Property.Left
  right?: Property.Right
  top?: Property.Top
  width?: Property.Width
}

const JGLabelRoot = styled(Typography, {
  name: 'JGLabel',
  slot: 'Root'
})(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  flexWrap: 'wrap',
  letterSpacing: 0,
  overflow: 'hidden',
  verticalAlign: 'middle'
}))

const JGLabel = forwardRef<HTMLElement, JGLabelProps>((inProps, ref) => {
  const context = useContext()
  const sx = inProps.sx || {}
  const props: JGLabelProps = {
    variant: 'body2',
    sx: {
      ...sx,
      height: toHeight(inProps.height, context, '24px'),
      width: toWidth(inProps.width, context, '68px'),
      position: context ? context.position : 'absolute',
      top: inProps.top ?? 0,
      right: inProps.right,
      left: inProps.left ?? 0,
      bottom: inProps.bottom
    }
  }
  return (
    <JGLabelRoot {...props} ref={ref}>
      {inProps.children}
    </JGLabelRoot>
  )
})

JGLabel.defaultProps = {
  height: '24px',
  width: '68px'
}

export default JGLabel
