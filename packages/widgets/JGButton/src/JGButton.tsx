import { forwardRef } from 'react'

import { Property } from 'csstype'

import { Button, ButtonProps, styled } from '@mui/material'

export interface JGButtonProps extends ButtonProps {
  bottom?: Property.Bottom | undefined
  height?: Property.Height | undefined
  left?: Property.Left | undefined
  right?: Property.Right | undefined
  top?: Property.Top | undefined
  width?: Property.Width | undefined
}

const JGButtonRoot = styled(Button, {
  name: 'JGButton',
  slot: 'Root'
})(({ theme }) => ({
  backgroundColor: '#356abb',
  fontWeight: 400,
  letterSpacing: 0,
  minWidth: 0,
  padding: theme.spacing(0, 0.25),
  position: 'absolute'
}))

const JGButton = forwardRef<HTMLButtonElement, JGButtonProps>(
  (inProps, ref) => {
    const props: ButtonProps = {
      variant: 'contained',
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
      <JGButtonRoot {...props} ref={ref}>
        {inProps.children}
      </JGButtonRoot>
    )
  }
)

export default JGButton
