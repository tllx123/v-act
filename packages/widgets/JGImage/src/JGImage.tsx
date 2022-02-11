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
  click?: Function
  imagePosition?: string
}

const JGImageRoot = styled(CardMedia, {
  name: 'JGImage',
  slot: 'Root'
})(({ theme }) => ({}))

const JGImage = forwardRef<HTMLDivElement, JGImageProps>((inProps, ref) => {
  const context = useContext()
  const sx = inProps.sx || {}
  const width = toWidth(inProps.width, context, '100px')
  const height = toHeight(inProps.height, context, '100px')
  const isWidthMornThenHeight =
    parseInt(width as string) > parseInt(height as string) ? true : false
  const props: JGImageProps = {
    //image: inProps.image? inProps.image : 'http://www.yindangu.com/itop/common/images/defaultImg.png',
    sx: {
      ...sx,
      height: height,
      width: width,
      position: context ? context.position : 'absolute',
      backgroundSize: 'auto',
      top: inProps.top ?? 0,
      right: inProps.right,
      left: inProps.left ?? 0,
      bottom: inProps.bottom,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
  }

  const clickHd = inProps.click
  const clickHandler = () => {
    if (clickHd) {
      clickHd.apply(this)
    }
  }

  return (
    <JGImageRoot {...props} ref={ref} onClick={clickHandler}>
      <img
        src={
          inProps.image
            ? inProps.image
            : 'http://www.yindangu.com/itop/common/images/defaultImg.png'
        }
        style={{
          width:
            inProps.imagePosition === 'fill'
              ? '100%'
              : isWidthMornThenHeight
              ? ''
              : '100%',
          height:
            inProps.imagePosition === 'fill'
              ? '100%'
              : isWidthMornThenHeight
              ? '100%'
              : ''
        }}
      ></img>
    </JGImageRoot>
  )
})

JGImage.defaultProps = {
  height: '100px',
  width: '100px'
}

export default JGImage
