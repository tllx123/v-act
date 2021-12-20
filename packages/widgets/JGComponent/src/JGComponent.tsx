import { forwardRef } from 'react'

import { Property } from 'csstype'

import { Box, BoxProps, styled } from '@mui/material'

interface JGComponentProps {
  bottom?: Property.Bottom
  height?: Property.Height
  left?: Property.Left
  right?: Property.Right
  top?: Property.Top
  width?: Property.Width
}

const JGComponentRoot = styled(Box, {
  name: 'JGComponent',
  slot: 'Root'
})(({ theme }) => ({
  position: 'relative'
}))

const JGComponent = forwardRef<HTMLDivElement, JGComponentProps>(
  (inProps, ref) => {
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
    return (
      <JGComponentRoot {...props} ref={ref}>
        {inProps.children}
      </JGComponentRoot>
    )
  }
)

export default JGComponent
export { JGComponent, type JGComponentProps }
