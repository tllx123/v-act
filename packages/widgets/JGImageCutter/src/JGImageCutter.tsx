import React, { CSSProperties } from 'react'

import { Property } from 'csstype'

import { Box, BoxProps } from '@mui/material'

import logo from './img/blank.png'

/* 包装器属性 */
export interface JGImageCutterProps extends BoxProps {
  /**
   * 编码
   */
  code?: string

  /**
   * 上边距
   */
  top?: number

  /**
   * 百分比高度
   */
  percentHeight?: number

  /**
   * 百分比宽度
   */
  percentWidth?: number

  /**
   * 是否调整大小
   */
  isAllowResize?: boolean

  /**
   * 选框高度
   */
  selectDivHeight?: number

  /**
   * 选框上边距
   */
  selectDivTop?: Property.Height

  /**
   * 高度
   */
  height?: number

  /**
   * 选框左边距
   */
  selectDivLeft?: Property.Height

  /**
   * 选框宽度
   */
  selectDivWidth?: number

  /**
   * 是否允许选择
   */
  isAllowSelect?: boolean

  /**
   * 左边距
   */
  left?: number

  /**
   * 是否缩放
   */
  isZoom?: boolean

  /**
   * 宽度
   */
  width?: number

  /**
   * 裁剪后图片标识
   */
  newImageObjId?: string

  /**
   * 裁剪完成事件
   */
  onSelected?: string

  /**
   * 实体名
   */
  tableName?: string

  /**
   * 字段名称
   */
  columnName?: string
}

const JGImageCutter = function (props: JGImageCutterProps) {
  /* 包装器样式 */
  const wrapStyles: CSSProperties = {
    width: props.width,
    height: props.height,
    left: props.left,
    top: props.top,
    display: 'inline-flex',
    fontSize: '14px',
    position: 'absolute',
    fontFamily:
      'Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\\5FAE\\8F6F\\96C5\\9ED1,Arial,sans-serif'
  }

  /* 编码(唯一) */
  const code = props.code
    ? props.code
    : `${Date.now()}${Math.random().toString(32).slice(2)}`

  return (
    <Box style={wrapStyles}>
      <img src={logo} />
    </Box>
  )
}

JGImageCutter.defaultProps = {}

export default JGImageCutter
export { JGImageCutter }
