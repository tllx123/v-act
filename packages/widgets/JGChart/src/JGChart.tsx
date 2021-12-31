import React, { CSSProperties } from 'react'

import { Property } from 'csstype'
import ReactECharts from 'echarts-for-react'

import { Box, BoxProps } from '@mui/material'
import { useContext } from '@v-act/widget-context'
import { toHeight, toLabelWidth, toWidth } from '@v-act/widget-utils'
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
  onChartClick?: string

  /********************** 数据 ************************/
  /**
   * 备注
   */
  tagData?: string

  /**
   * 实体
   */
  tableName?: string

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

  /* 编码(唯一) */
  const code = props.code
    ? props.code
    : `${Date.now()}${Math.random().toString(32).slice(2)}`

  let V3Data = JSON.parse(
    '{"recordCount":3,"values":[{"id":"20d063994f0e403ca5704663957b855b","name":"苹果","num":500},{"id":"29868461536f462189b78984e369fc5c","name":"雪梨","num":200},{"id":"ec1c843693b64663bd7102e39750293d","name":"香蕉","num":100}]}'
  )
  let a =
    '{&quot;PluginID&quot;:&quot;FusionChart&quot;,&quot;PluginName&quot;:&quot;Fusion图表&quot;,&quot;ChartID&quot;:&quot;1013&quot;,&quot;chartName&quot;:&quot;饼2D&quot;,&quot;chartType&quot;:&quot;Pie&quot;,&quot;is3D&quot;:&quot;false&quot;,&quot;path&quot;:&quot;fusionchart/FusionchartFactory&quot;,&quot;palette&quot;:&quot;1&quot;,&quot;size&quot;:{&quot;high&quot;:&quot;400&quot;,&quot;width&quot;:&quot;600&quot;},&quot;title&quot;:{&quot;font&quot;:&quot;黑体&quot;,&quot;fontSize&quot;:&quot;18&quot;,&quot;fontColor&quot;:&quot;#000000&quot;,&quot;alpha&quot;:&quot;0&quot;,&quot;bgColor&quot;:null,&quot;bold&quot;:&quot;0&quot;,&quot;italic&quot;:&quot;0&quot;,&quot;strikeout&quot;:&quot;0&quot;,&quot;underline&quot;:&quot;0&quot;,&quot;show&quot;:&quot;true&quot;,&quot;horizontal&quot;:&quot;center&quot;,&quot;vertical&quot;:&quot;top&quot;,&quot;title&quot;:&quot;水果&quot;},&quot;subtitle&quot;:{&quot;font&quot;:&quot;黑体&quot;,&quot;fontSize&quot;:&quot;12&quot;,&quot;fontColor&quot;:&quot;#000000&quot;,&quot;alpha&quot;:&quot;0&quot;,&quot;bgColor&quot;:null,&quot;bold&quot;:&quot;0&quot;,&quot;italic&quot;:&quot;0&quot;,&quot;strikeout&quot;:&quot;0&quot;,&quot;underline&quot;:&quot;0&quot;,&quot;show&quot;:&quot;true&quot;,&quot;horizontal&quot;:&quot;center&quot;,&quot;vertical&quot;:&quot;top&quot;,&quot;title&quot;:null},&quot;inCanvas&quot;:{&quot;font&quot;:&quot;黑体&quot;,&quot;fontSize&quot;:&quot;8&quot;,&quot;fontColor&quot;:&quot;#696969&quot;,&quot;alpha&quot;:&quot;100&quot;,&quot;bgColor&quot;:null,&quot;bold&quot;:&quot;0&quot;,&quot;italic&quot;:&quot;0&quot;,&quot;strikeout&quot;:&quot;0&quot;,&quot;underline&quot;:&quot;0&quot;},&quot;outCanvas&quot;:{&quot;font&quot;:&quot;黑体&quot;,&quot;fontSize&quot;:&quot;8&quot;,&quot;fontColor&quot;:&quot;#000000&quot;,&quot;alpha&quot;:&quot;100&quot;,&quot;bgColor&quot;:null,&quot;bold&quot;:&quot;0&quot;,&quot;italic&quot;:&quot;0&quot;,&quot;strikeout&quot;:&quot;0&quot;,&quot;underline&quot;:&quot;0&quot;},&quot;xAxis&quot;:{&quot;Title&quot;:null,&quot;font&quot;:null,&quot;fontSize&quot;:&quot;0&quot;,&quot;fontColor&quot;:null,&quot;labelDisplay&quot;:null,&quot;slantLabels&quot;:null,&quot;bold&quot;:&quot;0&quot;,&quot;italic&quot;:&quot;0&quot;,&quot;strikeout&quot;:&quot;0&quot;,&quot;underline&quot;:&quot;0&quot;,&quot;boundaryGap&quot;:&quot;false&quot;,&quot;scale&quot;:&quot;false&quot;,&quot;LabelShow&quot;:&quot;true&quot;,&quot;LineShow&quot;:&quot;true&quot;,&quot;TickShow&quot;:&quot;true&quot;,&quot;alignWithLabel&quot;:&quot;true&quot;,&quot;nameGap&quot;:null,&quot;nameLocation&quot;:null},&quot;yAxis&quot;:{&quot;Title&quot;:null,&quot;font&quot;:null,&quot;fontSize&quot;:&quot;0&quot;,&quot;fontColor&quot;:null,&quot;labelDisplay&quot;:null,&quot;slantLabels&quot;:null,&quot;bold&quot;:&quot;0&quot;,&quot;italic&quot;:&quot;0&quot;,&quot;strikeout&quot;:&quot;0&quot;,&quot;underline&quot;:&quot;0&quot;,&quot;boundaryGap&quot;:&quot;false&quot;,&quot;scale&quot;:&quot;false&quot;,&quot;LabelShow&quot;:&quot;true&quot;,&quot;LineShow&quot;:&quot;true&quot;,&quot;TickShow&quot;:&quot;true&quot;,&quot;isGradientColor&quot;:&quot;false&quot;,&quot;nameGap&quot;:null,&quot;nameLocation&quot;:null},&quot;DataInfo&quot;:{&quot;type&quot;:&quot;Entity&quot;,&quot;name&quot;:&quot;test&quot;,&quot;value&quot;:&quot;test&quot;},&quot;DataColumns&quot;:{&quot;value&quot;:[&quot;id&quot;,&quot;name&quot;,&quot;num&quot;,&quot;logo&quot;]},&quot;serie&quot;:{&quot;isVar&quot;:&quot;true&quot;,&quot;name&quot;:null,&quot;value&quot;:&quot;name&quot;,&quot;show&quot;:&quot;true&quot;,&quot;horizontal&quot;:&quot;center&quot;,&quot;vertical&quot;:&quot;bottom&quot;,&quot;orient&quot;:&quot;horizontal&quot;,&quot;itemGap&quot;:&quot;10&quot;,&quot;selectedOffset&quot;:&quot;10&quot;,&quot;selecteName&quot;:null,&quot;isShowLabel&quot;:&quot;true&quot;,&quot;isShowDataLabel&quot;:&quot;true&quot;,&quot;isShowLabelLine&quot;:&quot;true&quot;,&quot;radius&quot;:&quot;65%&quot;,&quot;center&quot;:[&quot;50%&quot;,&quot;50%&quot;]},&quot;x&quot;:{&quot;isVar&quot;:&quot;false&quot;,&quot;name&quot;:null,&quot;value&quot;:null},&quot;y&quot;:{&quot;name&quot;:&quot;num&quot;,&quot;code&quot;:&quot;num&quot;,&quot;stack&quot;:&quot;false&quot;,&quot;showlabel&quot;:&quot;false&quot;,&quot;position&quot;:&quot;top&quot;}}'
  let b = a.replaceAll('&quot;', '"')
  let V3ChartConfig = JSON.parse(b)
  //let V3ChartConfig = props.graphSettings ? JSON.parse(props.graphSettings) : {}

  const options = handleOptions(V3ChartConfig, V3Data)

  const context = useContext()

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
