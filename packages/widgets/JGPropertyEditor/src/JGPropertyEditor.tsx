import React, { CSSProperties } from 'react'

import { Property } from 'csstype'

import { Box, BoxProps } from '@mui/material'
import { Height, Width } from '@v-act/schema-types'
import { useContext } from '@v-act/widget-context'
import { toHeight, toWidth } from '@v-act/widget-utils'

interface JGPropertyEditorProps extends BoxProps {
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
}

const JGPropertyEditor = function (props: JGPropertyEditorProps) {
  const context = useContext()
  const width = toWidth(props.multiWidth, context, '235px')
  const height = toHeight(props.multiHeight, context, '26px')

  const wrapStyles: CSSProperties = {
    border: '1px solid',
    width: width,
    height: height,
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    position: context.position,
    left: props.left,
    overflow: 'visible',
    top: props.top,
    fontFamily:
      'Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\\5FAE\\8F6F\\96C5\\9ED1,Arial,sans-serif'
  }

  return <Box style={wrapStyles}></Box>
}

JGPropertyEditor.defaultProps = {
  left: '0px',
  top: '0px',
  multiHeight: '195px',
  multiWidth: '237px'
}

export default JGPropertyEditor
export { JGPropertyEditor, type JGPropertyEditorProps }
