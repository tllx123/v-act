import { forwardRef } from 'react'

import { Property } from 'csstype'

import { styled, Typography, TypographyProps } from '@mui/material'

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
  position: 'absolute',
  verticalAlign: 'middle'
}))

const JGLabel = forwardRef<HTMLElement, JGLabelProps>((inProps, ref) => {
  const props: JGLabelProps = {
    variant: 'body2',
    sx: {
      width: inProps.width,
      top: inProps.top ?? 0,
      right: inProps.right,
      left: inProps.left ?? 0,
      height: inProps.height,
      bottom: inProps.bottom
    }
  }
  return (
    <JGLabelRoot {...props} ref={ref}>
      {inProps.children}
    </JGLabelRoot>
  )
})

export default JGLabel
