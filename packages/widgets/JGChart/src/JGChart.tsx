import React, { CSSProperties } from 'react'

import { Property } from 'csstype'
import ReactECharts from 'echarts-for-react'

import Box, { BoxProps } from '@mui/material/Box'
import { EntityRecord, useContext } from '@v-act/widget-context'
import { getEntityDatas, toHeight, toWidth } from '@v-act/widget-utils'

import { handleOptions } from './V3Echart'

/* 包装器属性 */
interface JGChartProps extends BoxProps {
  /********************** 格式 ************************/
  /**
   * 控件名称
   */
  alias?: string

  /**
   * 控件编码
   */
  code?: string

  /********************** 格式 ************************/
  /**
   * 上边距
   */
  top?: Property.Top

  /**
   * 宽度(优先)
   */
  multiWidth?: Property.Width

  /**
   * 高度(优先)
   */
  multiHeight?: Property.Height

  /**
   * 百分比高度
   */
  percentHeight?: number

  /**
   * 百分比宽度
   */
  percentWidth?: number

  /**
   * 显示
   */
  visible?: boolean

  /**
   * 界面顺序号
   */
  tabIndex?: number

  /**
   * 高度
   */
  height?: Property.Height

  /**
   * 左边距
   */
  left?: Property.Left

  /**
   * 主标题
   */
  title?: string

  /**
   * 锚定
   */
  anchor?: boolean

  /**
   * 泊靠
   */
  dock?: boolean

  /**
   * 副标题
   */
  subTitle?: boolean

  /**
   * 宽度
   */
  width?: Property.Width

  /**
   * 宽度固定
   */
  staticLayoutSize?: string

  /********************** 数据 ************************/
  /**
   * 图形单击
   */
  onChartClick?: Function

  /********************** 数据 ************************/
  /**
   * 备注
   */
  tagData?: string

  /**
   * 实体
   */
  tableName?: string | null

  /**
   * 图表设计
   */
  graphSettings?: string

  /**
   * 浮动提示
   */
  toolTip?: string
}

const JGChart = function (props: JGChartProps) {
  /* 如果复选框组不可见，直接返回null */
  if (!props.visible) {
    return null
  }

  console.log('JGChart自动打包了吗？', '预览很久啊')

  /* 编码(唯一) */
  const code = props.code
    ? props.code
    : `${Date.now()}${Math.random().toString(32).slice(2)}`

  const context = useContext()
  /* 处理值，用于绑定到value属性上 */
  let value: EntityRecord[] | null = []
  if (props.tableName) {
    value = getEntityDatas(props.tableName, context)
  }
  /* 构造v3chart图表数据 */
  let V3ChartConfig = props.graphSettings ? JSON.parse(props.graphSettings) : {}
  let V3Data = {
    recordCount: value?.length || 0,
    values: value || []
  }
  const options = handleOptions(V3ChartConfig, V3Data)

  /* 包装器样式 */
  const wrapStyles: CSSProperties = {
    width: toWidth(props.multiWidth, context, '235px'),
    height: toHeight(props.multiHeight, context, '26px'),
    left: props.left,
    top: props.top,
    display: 'inline-flex',
    fontSize: '14px',
    position: context.position,
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
        onEvents={{
          click: props.onChartClick ? props.onChartClick : function () {}
        }}
      />
    </Box>
  )
}

JGChart.defaultProps = {
  left: '0px',
  top: '0px',
  height: '213px',
  width: '462px',
  multiHeight: '213px',
  multiWidth: '462px',
  visible: true
}

export default JGChart
export { JGChart, type JGChartProps }
