import { forwardRef } from 'react'

import { Property } from 'csstype'

import { Button, ButtonProps, styled } from '@mui/material'
import { useContext } from '@v-act/widget-context'
import { toHeight, toWidth } from '@v-act/widget-utils'

export interface JGButtonProps extends ButtonProps {
  bottom?: Property.Bottom | undefined
  height?: Property.Height | undefined
  left?: Property.Left | undefined
  right?: Property.Right | undefined
  top?: Property.Top | undefined
  width?: Property.Width | undefined
  click?: Function
}

const JGButtonRoot = styled(Button, {
  name: 'JGButton',
  slot: 'Root'
})(({ theme }) => ({
  backgroundColor: '#356abb',
  fontWeight: 400,
  letterSpacing: 0,
  minWidth: 0,
  padding: theme.spacing(0, 0.25)
}))

const JGButton = forwardRef<HTMLButtonElement, JGButtonProps>(
  (inProps, ref) => {
    const context = useContext()
    const sx = inProps.sx || {}
    const props: ButtonProps = {
      variant: 'contained',
      sx: {
        ...sx,
        width: toWidth(inProps.width, context, '59px'),
        top: inProps.top ?? 0,
        right: inProps.right,
        left: inProps.left ?? 0,
        height: toHeight(inProps.height, context, '26px'),
        bottom: inProps.bottom,
        position: context ? context.position : 'absolute'
      }
    }
    const clickHd = inProps.click
    const clickHandler = () => {
      if (clickHd) {
        clickHd.apply(this)
      }
    }
    return (
      <JGButtonRoot {...props} ref={ref} onClick={clickHandler}>
        {inProps.children}
      </JGButtonRoot>
    )
  }
)

JGButton.defaultProps = {
  height: '26px',
  width: '59px'
}

export default JGButton
