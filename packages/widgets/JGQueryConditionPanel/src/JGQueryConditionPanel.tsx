import React, { CSSProperties } from 'react'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { Height, Width } from '@v-act/schema-types'
import { useContext, withContext } from '@v-act/widget-context'

interface JGQueryConditionPanelProps {
  /**
   * 左边距
   */
  left?: number
  /**
   * 上边距
   */
  top?: number
  /**
   * 高度
   */
  multiHeight?: Height
  /**
   * 宽度
   */
  multiWidth?: Width
  /**
   * 显示
   */
  visible?: boolean
  /**
   * 默认展开
   */
  defaultExpand?: boolean
  /**
   * 布局位置
   */
  position?: string

  children?: Array<JSX.Element> | null
}

const JGQueryConditionPanel = withContext(function (
  props: JGQueryConditionPanelProps
) {
  if (typeof props.visible == 'boolean' && !props.visible) {
    return null
  }
  const context = useContext()
  const wrapStyles: CSSProperties = {
    width: props.multiWidth,
    height: props.multiHeight,
    fontSize: '14px',
    left: props.left,
    top: props.top,
    position: context.position,
    fontFamily:
      'Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\\5FAE\\8F6F\\96C5\\9ED1,Arial,sans-serif'
  }
  return (
    <div style={wrapStyles}>
      {props.children
        ? props.children.map((child, index) => {
            return (
              <Stack key={index}>
                <Box>{child}</Box>
              </Stack>
            )
          })
        : null}
    </div>
  )
})

export default JGQueryConditionPanel
export { JGQueryConditionPanel, type JGQueryConditionPanelProps }
