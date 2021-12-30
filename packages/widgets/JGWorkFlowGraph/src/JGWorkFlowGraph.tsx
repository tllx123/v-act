import 'cropperjs/dist/cropper.css'

import React, { CSSProperties } from 'react'

import { Property } from 'csstype'

import { Box, BoxProps } from '@mui/material'
import { useContext } from '@v-act/widget-context'

import logo from './img/blank.png'

/* 包装器属性 */
interface JGWorkFlowGraphProps extends BoxProps {
  /************************** 其它 **************************************/
  /**
   * 控件名称
   */
  alias?: string

  /**
   * 控件编码
   */
  code?: string

  /************************** 格式 **************************************/
  /**
   * 活动名称对齐方式
   */
  valueTextAlign?: string

  /**
   * 上边距
   */
  top?: Property.Top

  /**
   * 百分比高度
   */
  percentHeight?: number

  /**
   * 显示
   */
  visible?: boolean

  /**
   * 百分比宽度
   */
  percentWidth?: number

  /**
   * 泊靠
   */
  dock?: number

  /**
   * 界面顺序号
   */
  tabIndex?: number

  /**
   * 活动名称字体
   */
  valueFontStyle?: number

  /**
   * 高度
   */
  height?: number

  /**
   * 宽度
   */
  width?: number

  /**
   * 左边距
   */
  left?: Property.Left

  /**
   * 宽度固定
   */
  staticLayoutSize?: string

  /**
   * 宽度(优先)
   */
  multiWidth?: Property.Width

  /**
   * 高度(优先)
   */
  multiHeight?: Property.Height

  /************************** 事件 **************************************/
  /**
   * 活动选择事件
   */
  onActivitySelected?: string

  /************************** 数据 **************************************/
  /**
   * 只读
   */
  readOnly?: string

  /**
   * 流程数据XML
   */
  processFileXML?: string

  /**
   * 关联活动面板
   */
  relaJGActivityPanel?: string

  /**
   * 备注
   */
  tagData?: string

  /**
   * 关联属性编辑器
   */
  relaJGPropertyEditor?: string

  /**
   * 流程定义数据
   */
  definitionJson?: string

  /**
   * 流程图形XML
   */
  graphXML?: string

  /**
   * 实体名
   */
  tableName?: string

  /**
   * 字段名称
   */
  columnName?: string
}

const JGWorkFlowGraph = function (props: JGWorkFlowGraphProps) {
  /* 如果流程图不可见，直接返回null */
  if (!props.visible) {
    return null
  }

  const context = useContext()

  /* 包装器样式 */
  const wrapStyles: CSSProperties = {
    width: props.multiWidth,
    height: props.multiHeight,
    left: props.left,
    top: props.top,
    display: 'inline-flex',
    fontSize: '14px',
    position: context.position,
    backgroundImage: `url(${logo})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
    fontFamily:
      'Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\\5FAE\\8F6F\\96C5\\9ED1,Arial,sans-serif'
  }

  /* 编码(唯一) */
  const code = props.code
    ? props.code
    : `${Date.now()}${Math.random().toString(32).slice(2)}`

  return <Box style={wrapStyles}></Box>
}

JGWorkFlowGraph.defaultProps = {
  left: 0,
  top: 0,
  height: '532px',
  width: '766px',
  multiWidth: '766px',
  multiHeight: '532px',
  visible: true
}

export default JGWorkFlowGraph
export { JGWorkFlowGraph, type JGWorkFlowGraphProps }
