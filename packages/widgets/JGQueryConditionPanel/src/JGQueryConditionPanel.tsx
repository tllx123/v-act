import React, { CSSProperties } from 'react'

import { Property } from 'csstype'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { Control, Height, Width } from '@v-act/schema-types'
import { useContext } from '@v-act/widget-context'
import {
  toBoolean,
  toNumber,
  valueofHeight,
  valueofWidth
} from '@v-act/widget-utils'

import { convert as JGQueryConditionPanelFormConvert } from './JGQueryConditionPanelForm'
import { convert as JGQueryConditionPanelToolbarConvert } from './JGQueryConditionPanelToolbar'

interface JGQueryConditionPanelProps {
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

const JGQueryConditionPanel = function (props: JGQueryConditionPanelProps) {
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
}

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element[] | null
) {
  const pros = control.properties
  const props: JGQueryConditionPanelProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    multiWidth: valueofWidth(pros.multiWidth, '500px'),
    multiHeight: valueofHeight(pros.multiHeight, '40px'),
    visible: toBoolean(pros.visible, true),
    defaultExpand: toBoolean(pros.defaultExpand, true)
  }
  const children = [
    JGQueryConditionPanelToolbarConvert(control, render),
    JGQueryConditionPanelFormConvert(control, render)
  ]

  return <JGQueryConditionPanel {...props}>{children}</JGQueryConditionPanel>
}

export default JGQueryConditionPanel
export { convert, JGQueryConditionPanel, type JGQueryConditionPanelProps }
