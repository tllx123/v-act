import React from 'react'

import { Property } from 'csstype'

import Link from '@mui/material/Link'
import { Height, Width } from '@v-act/schema-types'

enum TextAlignType {
  'Left' = 'left',
  'Center' = 'center',
  'Right' = 'right'
}
interface JGLinkLabelProps {
  /**
   * 左边距
   */
  left?: Property.Left
  /**
   * 上边距
   */
  top?: Property.Top
  /**
   * 高度
   */
  multiHeight?: Height
  /**
   * 宽度
   */
  multiWidth?: Width
  /**
   * 标题
   */
  labelText?: string
  /**
   * 显示
   */
  visible?: boolean

  /**
   * 显示宽度
   */
  width?: Property.Width

  /**
   * 显示高度
   */
  height?: Property.Height
  textAlign?: TextAlignType
  webURL?: string
  target?: string
  foreColor: string
}

const JGLinkLabel = function (props: JGLinkLabelProps) {
  if (!props.visible) {
    return null
  }
  let lineHeight =
    String(props.height || props.multiHeight).indexOf('px') !== -1
      ? props.height || props.multiHeight
      : (props.height || props.multiHeight) + 'px'
  const wrapSx: React.CSSProperties = {
    width: props.width || props.multiWidth,
    height: props.height || props.multiHeight,
    fontSize: '14px',
    position: 'absolute',
    left: props.left,
    top: props.top,
    fontFamily:
      'Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\\5FAE\\8F6F\\96C5\\9ED1,Arial,sans-serif',
    textAlign: props.textAlign,
    lineHeight: lineHeight
  }

  return (
    <div style={wrapSx}>
      <Link
        href={props.webURL || '#'}
        underline="hover"
        target={props.target || ''}
        color={props.foreColor}
      >
        {props.labelText}
      </Link>
    </div>
  )
}

JGLinkLabel.defaultProps = {
  left: 0,
  top: 0,
  multiHeight: 24,
  multiWidth: 68,
  visible: true,
  textAlign: 'Left',
  foreColor: '#ff0000'
}

export default JGLinkLabel
export { JGLinkLabel, JGLinkLabelProps }
