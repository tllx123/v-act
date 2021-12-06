import { forwardRef } from 'react'

import { Property } from 'csstype'

import { Button, ButtonProps, styled } from '@mui/material'

interface JGButtonProps extends ButtonProps {
  height?: Property.Height
  width?: Property.Width
}

const JGButtonRoot = styled(Button, {
  name: 'JGButton',
  slot: 'Root'
})({
  padding: 0
})

const JGButton = forwardRef<HTMLButtonElement, JGButtonProps>(
  (inProps, ref) => {
    const props: ButtonProps = {
      variant: 'contained',
      sx: {
        height: inProps.height,
        width: inProps.width
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
