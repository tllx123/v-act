import { forwardRef } from 'react'

import { Property } from 'csstype'

import { CardMedia, CardMediaProps, styled } from '@mui/material'
import { useContext } from '@v-act/widget-context'
import { toHeight, toWidth } from '@v-act/widget-utils'

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
})(({ theme }) => ({}))

const JGImage = forwardRef<HTMLDivElement, JGImageProps>((inProps, ref) => {
  const context = useContext()
  const sx = inProps.sx || {}
  const props: JGImageProps = {
    image: 'http://www.yindangu.com/itop/common/images/defaultImg.png',
    sx: {
      ...sx,
      height: toHeight(inProps.height, context, '100px'),
      width: toWidth(inProps.width, context, '100px'),
      position: context ? context.position : 'absolute',
      backgroundSize: 'auto',
      top: inProps.top ?? 0,
      right: inProps.right,
      left: inProps.left ?? 0,
      bottom: inProps.bottom
    }
  }
  return <JGImageRoot {...props} ref={ref} />
})

JGImage.defaultProps = {
  height: '100px',
  width: '100px'
}

export default JGImage
