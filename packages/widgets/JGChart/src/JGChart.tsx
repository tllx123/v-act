import React, { CSSProperties } from 'react'

import ReactECharts from 'echarts-for-react'

import { Box, BoxProps } from '@mui/material'

import { handleOptions } from './V3Echart'

/* 包装器属性 */
export interface JGChartProps extends BoxProps {
  /**
   * 控件名称
   */
  alias?: string

  /**
   * 控件编码
   */
  code?: string

  /**
   * 百分比高度
   */
  percentHeight?: number

  /**
   * 上边距
   */
  top?: number

  /**
   * 百分比宽度
   */
  percentWidth?: number

  /**
   * 显示
   */
  visible?: boolean

  /**
   * 图表设计
   */
  graphSettings?: string

  width?: number

  height?: number

  left?: number
}

const JGChart = function (props: JGChartProps) {
  /* 如果复选框组不可见，直接返回null */
  if (!props.visible) {
    return null
  }

  /* 编码(唯一) */
  const code = props.code
    ? props.code
    : `${Date.now()}${Math.random().toString(32).slice(2)}`

  let V3Data = JSON.parse(
    '{"recordCount":3,"values":[{"id":"20d063994f0e403ca5704663957b855b","name":"苹果","num":500},{"id":"29868461536f462189b78984e369fc5c","name":"雪梨","num":200},{"id":"ec1c843693b64663bd7102e39750293d","name":"香蕉","num":100}]}'
  )
  let V3ChartConfig = props.graphSettings ? JSON.parse(props.graphSettings) : {}

  const options = handleOptions(V3ChartConfig, V3Data)

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

  return (
    <Box style={wrapStyles}>
      <ReactECharts
        option={options}
        notMerge={true}
        lazyUpdate={true}
        style={{ width: '100%', height: '100%' }}
      />
    </Box>
  )
}

JGChart.defaultProps = {
  left: 0,
  top: 0,
  height: '26px',
  width: 500,
  labelWidth: 94,
  labelText: '多选组',
  placeholder: '',
  visible: true,
  labelVisible: true,
  disabled: false
}

export default JGChart
export { JGChart }
