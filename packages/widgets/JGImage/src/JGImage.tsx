import { forwardRef } from 'react'

import { Property } from 'csstype'

import { CardMedia, CardMediaProps, styled } from '@mui/material'

export interface JGImageProps extends CardMediaProps {
  bottom?: Property.Bottom
  height?: Property.Height
  left?: Property.Left
  right?: Property.Right
  top?: Property.Top
  width?: Property.Width
}

const JGImageRoot = styled(CardMedia, {
  name: 'JGImage',
  slot: 'Root'
})(({ theme }) => ({
  position: 'absolute'
}))

const JGImage = forwardRef<HTMLDivElement, JGImageProps>((inProps, ref) => {
  const props: JGImageProps = {
    image: 'http://www.yindangu.com/itop/common/images/defaultImg.png',
    sx: {
      backgroundSize: 'auto',
      width: inProps.width,
      top: inProps.top ?? 0,
      right: inProps.right,
      left: inProps.left ?? 0,
      height: inProps.height,
      bottom: inProps.bottom
    }
  }
  return <JGImageRoot {...props} ref={ref} />
})

export default JGImage
