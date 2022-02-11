import { forwardRef } from 'react'

import { Property } from 'csstype'

import { styled } from '@mui/material/styles'
import Typography, { TypographyProps } from '@mui/material/Typography'
import { useContext } from '@v-act/widget-context'
import { toHeight, toWidth } from '@v-act/widget-utils'

export interface JGLabelProps extends TypographyProps {
  bottom?: Property.Bottom
  height?: Property.Height
  left?: Property.Left
  right?: Property.Right
  top?: Property.Top
  width?: Property.Width
  click?: Function
  /**
   * 字体
   */
  fontStyle?: Property.FontStyle

  /**
   * 标签对齐方式
   */
  textAlign?: Property.TextAlign

  /**
   * 前景色
   */
  foreColor?: string
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
  const fontStyle = JSON.parse(inProps.fontStyle || '{}')
  const { Family, Bold, Italic, Size, Strikeout, Underline, Unit } = fontStyle

  const props: JGLabelProps = {
    variant: 'body2',
    justifyContent: inProps.textAlign ? inProps.textAlign : '',
    sx: {
      ...sx,
      fontFamily: Family ? Family : '',
      fontWeight: Bold ? 'bold' : '',
      fontSize: Size ? `${Size}${Unit === 'Pixel' ? 'px' : 'rem'}` : '',
      textDecoration: `${Strikeout ? 'line-through' : ''} ${
        Underline ? 'underline' : ''
      }`,
      fontStyle: Italic ? 'italic' : '',
      color: inProps.foreColor ? `rgb(${inProps.foreColor})` : '',
      height: toHeight(inProps.height, context, '24px'),
      width: toWidth(inProps.width, context, '68px'),
      position: context ? context.position : 'absolute',
      top: inProps.top ?? 0,
      right: inProps.right,
      left: inProps.left ?? 0,
      bottom: inProps.bottom
    }
  }

  const clickHd = inProps.click
  const clickHandler = () => {
    if (clickHd) {
      clickHd.apply(this)
    }
  }

  return (
    <JGLabelRoot
      {...props}
      ref={ref}
      onClick={clickHandler}
      fontStyle={inProps.fontStyle}
    >
      {inProps.children}
    </JGLabelRoot>
  )
})

JGLabel.defaultProps = {
  height: '24px',
  width: '68px'
}

export default JGLabel
