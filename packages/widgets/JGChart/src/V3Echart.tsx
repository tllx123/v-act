import * as echarts from 'echarts'

const cacl = function <T>(arr: Array<T>, callback: Function) {
  var ret
  for (var i = 0; i < arr.length; i++) {
    ret = callback(arr[i], ret)
  }
  return ret
}
/**
 * 计算数组中最大值
 */
const caclArrayMaxValue = function (arr: Array<number>) {
  return cacl(arr, function (item: number, max: number) {
    if (!(max > item)) {
      return item
    } else {
      return max
    }
  })
}

/**
 * 计算数组中最小值
 */
const caclArrayMinValue = function (arr: Array<number>) {
  return cacl(arr, function (item: number, min: number) {
    if (!(min < item)) {
      return item
    } else {
      return min
    }
  })
}

/**
 * 计算数组项总和
 */
const caclArraySumValue = function (arr: Array<number>) {
  return cacl(arr, function (item: number, sum: number) {
    if (typeof sum == 'undefined') {
      return item
    } else {
      return (sum += item)
    }
  })
}

const caclArrayAvgValue = function (arr: Array<number>) {
  const arrLen = arr.length
  if (arrLen == 0) {
    return 0
  }
  return caclArraySumValue(arr) / arrLen
}

// 获取图表类型
const getChartType = function (ChartType: any) {
  // line 折线图
  // bar 横向柱状图
  // stack 纵向折叠图
  // pie 饼图
  // radar 雷达图
  // combidy 双Y
  // combination 组合
  // scatter 散点图
  switch (ChartType.toLowerCase()) {
    case 'area':
      return 'line'
      break // 区域图
    case 'column':
      return 'bar'
      break // 纵向柱状图
    case 'stackcolumn':
      return 'bar'
      break // 纵向折叠柱状图
    case 'stackbar':
      return 'bar'
      break // 横向折叠图
    case 'rose':
      return 'pie'
      break // 玫瑰图
    case 'dough':
      return 'pie'
      break // 环状图
    case 'bubble':
      return 'scatter'
      break // 气泡图
    default:
      return ChartType.toLowerCase()
  }
}

// 随机获得图表类型
function RandomChartType() {
  var ChartType = ['line', 'area', 'column']
  return ChartType[Math.floor(Math.random() * ChartType.length)]
}

//升级图表配置
function upgradeChartConfig(V3ChartConfig: any) {
  let chartType = V3ChartConfig.chartType.toLowerCase()
  //是否显示主、副标题
  if (typeof V3ChartConfig.title.show == 'undefined') {
    V3ChartConfig.title.show = true
  } else if (typeof V3ChartConfig.title.show == 'string') {
    V3ChartConfig.title.show =
      V3ChartConfig.title.show.toLowerCase() == 'true' ? true : false
  }

  //主、副标题横向位置
  if (typeof V3ChartConfig.title.horizontal == 'undefined') {
    V3ChartConfig.title.horizontal = 'center'
  }

  //主、副标题竖向位置
  if (typeof V3ChartConfig.title.vertical == 'undefined') {
    V3ChartConfig.title.vertical = 'top'
  }

  //是否显图例
  if (typeof V3ChartConfig.serie.show == 'undefined') {
    V3ChartConfig.serie.show = true
  } else if (typeof V3ChartConfig.serie.show == 'string') {
    V3ChartConfig.serie.show =
      V3ChartConfig.serie.show.toLowerCase() == 'true' ? true : false
  }

  //图例横向位置
  if (typeof V3ChartConfig.serie.horizontal == 'undefined') {
    V3ChartConfig.serie.horizontal = 'center'
  }

  //图例竖向位置
  if (typeof V3ChartConfig.serie.vertical == 'undefined') {
    V3ChartConfig.serie.vertical = 'bottom'
  }

  //图例排列方向
  if (typeof V3ChartConfig.serie.orient == 'undefined') {
    V3ChartConfig.serie.orient = 'horizontal'
  }

  //图例每项之间的间隔
  if (typeof V3ChartConfig.serie.itemGap == 'undefined') {
    V3ChartConfig.serie.itemGap = 10
  } else {
    V3ChartConfig.serie.itemGap = V3ChartConfig.serie.itemGap * 1
  }

  //雷达图
  if (chartType == 'radar') {
    if (
      V3ChartConfig.x.value == null &&
      typeof V3ChartConfig.serie.values == 'undefined' &&
      typeof V3ChartConfig.serie.value != null
    ) {
      V3ChartConfig.x.value = V3ChartConfig.serie.value
      V3ChartConfig.serie.value = null
    }
  }

  //雷达图 是否填充颜色
  if (typeof V3ChartConfig.serie.FillColor == 'undefined') {
    V3ChartConfig.serie.FillColor = false
  } else if (typeof V3ChartConfig.serie.FillColor == 'string') {
    V3ChartConfig.serie.FillColor =
      V3ChartConfig.serie.FillColor.toLowerCase() == 'true' ? true : false
  }

  //雷达图，显示图形 polygon 多边形和circle 圆环，默认 polygon
  if (typeof V3ChartConfig.serie.shape == 'undefined') {
    V3ChartConfig.serie.shape = 'polygon'
  }

  //雷达图，起始角度
  if (typeof V3ChartConfig.serie.startAngle == 'undefined') {
    V3ChartConfig.serie.startAngle = 90
  } else {
    V3ChartConfig.serie.startAngle = V3ChartConfig.serie.startAngle * 1
  }

  //饼图、环图、玫瑰图、雷达图，显示占比
  if (typeof V3ChartConfig.serie.radius == 'undefined') {
    V3ChartConfig.serie.radius = '65%'
  }

  //内环半径，若无此配置项，需要兼容处理
  if (typeof V3ChartConfig.serie.innerRadius == 'undefined') {
    //玫瑰图
    if (chartType == 'rose') {
      V3ChartConfig.serie.innerRadius = '0%'
    }
    //other
    else {
      V3ChartConfig.serie.innerRadius = '40%'
    }
  }

  //饼图、环图、玫瑰图、雷达图，中心点位置
  if (typeof V3ChartConfig.serie.center == 'undefined') {
    V3ChartConfig.serie.center = ['50%', '50%']
  }

  //饼图、环图、玫瑰图，选中扇区的偏移距离
  if (typeof V3ChartConfig.serie.selectedOffset == 'undefined') {
    V3ChartConfig.serie.selectedOffset = 10
  } else {
    V3ChartConfig.serie.selectedOffset = V3ChartConfig.serie.selectedOffset * 1
  }

  //饼图、环图、玫瑰图,默认选中项
  if (typeof V3ChartConfig.serie.selecteName == 'undefined') {
    V3ChartConfig.serie.selecteName = ''
  }

  //饼图、环图、玫瑰图 是否显示百分比
  if (typeof V3ChartConfig.serie.isShowDataLabel == 'undefined') {
    V3ChartConfig.serie.isShowDataLabel = false
  } else if (typeof V3ChartConfig.serie.isShowDataLabel == 'string') {
    V3ChartConfig.serie.isShowDataLabel =
      V3ChartConfig.serie.isShowDataLabel.toLowerCase() == 'true' ? true : false
  }

  //饼图、环图、玫瑰图 是否显示标签
  if (typeof V3ChartConfig.serie.isShowLabel == 'undefined') {
    V3ChartConfig.serie.isShowLabel = true
  } else if (typeof V3ChartConfig.serie.isShowLabel == 'string') {
    V3ChartConfig.serie.isShowLabel =
      V3ChartConfig.serie.isShowLabel.toLowerCase() == 'true' ? true : false
  }

  //是否渐变色
  if (V3ChartConfig.yAxis) {
    if (typeof V3ChartConfig.yAxis.isGradientColor == 'undefined') {
      V3ChartConfig.yAxis.isGradientColor = false
    } else if (typeof V3ChartConfig.yAxis.isGradientColor == 'string') {
      V3ChartConfig.yAxis.isGradientColor =
        V3ChartConfig.yAxis.isGradientColor.toLowerCase() == 'true'
          ? true
          : false
    }
  }

  //自定义配色
  if (typeof V3ChartConfig.color != 'undefined') {
    if (typeof V3ChartConfig.color.length == 'undefined') {
      V3ChartConfig.y = [V3ChartConfig.color]
    }

    if (V3ChartConfig.color.length == 0) {
      delete V3ChartConfig.color
    }
  }

  //数据项
  if (typeof V3ChartConfig.y.length == 'undefined') {
    V3ChartConfig.y = [V3ChartConfig.y]
  }

  //x轴
  if (V3ChartConfig.xAxis == null) {
    delete V3ChartConfig.xAxis
  }

  if (typeof V3ChartConfig.xAxis != 'undefined') {
    //坐标轴名称与轴线之间的距离
    if (typeof V3ChartConfig.xAxis.nameGap == 'undefined') {
      if (
        V3ChartConfig.chartType.toLowerCase() == 'bar' ||
        V3ChartConfig.chartType.toLowerCase() == 'stackbar'
      ) {
        V3ChartConfig.xAxis.nameGap = 35
      } else {
        V3ChartConfig.xAxis.nameGap = 25
      }
    } else if (typeof V3ChartConfig.xAxis.nameGap == 'string') {
      V3ChartConfig.xAxis.nameGap = V3ChartConfig.xAxis.nameGap * 1
    }

    //坐标轴名称显示位置'start' 起点 'middle'中间 'end'末尾，默认 middle
    if (typeof V3ChartConfig.xAxis.nameLocation == 'undefined') {
      V3ChartConfig.xAxis.nameLocation = 'middle'
    }

    //坐标轴两边留白策略
    if (typeof V3ChartConfig.xAxis.boundaryGap == 'undefined') {
      V3ChartConfig.xAxis.boundaryGap = false
    } else if (typeof V3ChartConfig.xAxis.boundaryGap == 'string') {
      V3ChartConfig.xAxis.boundaryGap =
        V3ChartConfig.xAxis.boundaryGap.toLowerCase() == 'true' ? true : false
    }

    //坐标刻度不会强制包含零刻度
    if (typeof V3ChartConfig.xAxis.scale == 'undefined') {
      V3ChartConfig.xAxis.scale = false
    } else if (typeof V3ChartConfig.xAxis.scale == 'string') {
      V3ChartConfig.xAxis.scale =
        V3ChartConfig.xAxis.scale.toLowerCase() == 'true' ? true : false
    }

    //是否显示坐标轴标题
    if (typeof V3ChartConfig.xAxis.LabelShow == 'undefined') {
      V3ChartConfig.xAxis.LabelShow = true
    } else if (typeof V3ChartConfig.xAxis.LabelShow == 'string') {
      V3ChartConfig.xAxis.LabelShow =
        V3ChartConfig.xAxis.LabelShow.toLowerCase() == 'true' ? true : false
    }

    //是否显示坐标轴轴线
    if (typeof V3ChartConfig.xAxis.LineShow == 'undefined') {
      V3ChartConfig.xAxis.LineShow = true
    } else if (typeof V3ChartConfig.xAxis.LineShow == 'string') {
      V3ChartConfig.xAxis.LineShow =
        V3ChartConfig.xAxis.LineShow.toLowerCase() == 'true' ? true : false
    }

    //是否显示坐标轴刻度
    if (typeof V3ChartConfig.xAxis.TickShow == 'undefined') {
      V3ChartConfig.xAxis.TickShow = true
    } else if (typeof V3ChartConfig.xAxis.TickShow == 'string') {
      V3ChartConfig.xAxis.TickShow =
        V3ChartConfig.xAxis.TickShow.toLowerCase() == 'true' ? true : false
    }

    //刻度线和标签是否对齐
    if (typeof V3ChartConfig.xAxis.alignWithLabel == 'undefined') {
      V3ChartConfig.xAxis.alignWithLabel = true
    } else if (typeof V3ChartConfig.xAxis.alignWithLabel == 'string') {
      V3ChartConfig.xAxis.alignWithLabel =
        V3ChartConfig.xAxis.alignWithLabel.toLowerCase() == 'true'
          ? true
          : false
    }
  }

  //y轴
  if (V3ChartConfig.yAxis == null) {
    delete V3ChartConfig.yAxis
  }

  if (typeof V3ChartConfig.yAxis != 'undefined') {
    //坐标轴名称与轴线之间的距离
    if (typeof V3ChartConfig.yAxis.nameGap == 'undefined') {
      if (
        V3ChartConfig.chartType.toLowerCase() == 'bar' ||
        V3ChartConfig.chartType.toLowerCase() == 'stackbar'
      ) {
        V3ChartConfig.yAxis.nameGap = 25
      } else {
        V3ChartConfig.yAxis.nameGap = 35
      }
    } else if (typeof V3ChartConfig.yAxis.nameGap == 'string') {
      V3ChartConfig.yAxis.nameGap = V3ChartConfig.yAxis.nameGap * 1
    }

    //坐标轴名称显示位置'start' 起点 'middle'中间 'end'末尾，默认 middle
    if (typeof V3ChartConfig.yAxis.nameLocation == 'undefined') {
      V3ChartConfig.yAxis.nameLocation = 'middle'
    }

    //坐标轴两边留白策略
    if (typeof V3ChartConfig.yAxis.boundaryGap == 'undefined') {
      V3ChartConfig.yAxis.boundaryGap = false
    } else if (typeof V3ChartConfig.yAxis.boundaryGap == 'string') {
      V3ChartConfig.yAxis.boundaryGap =
        V3ChartConfig.yAxis.boundaryGap.toLowerCase() == 'true' ? true : false
    }

    //坐标刻度不会强制包含零刻度
    if (typeof V3ChartConfig.yAxis.scale == 'undefined') {
      V3ChartConfig.yAxis.scale = false
    } else if (typeof V3ChartConfig.yAxis.scale == 'string') {
      V3ChartConfig.yAxis.scale =
        V3ChartConfig.yAxis.scale.toLowerCase() == 'true' ? true : false
    }

    //是否显示坐标轴标题
    if (typeof V3ChartConfig.yAxis.LabelShow == 'undefined') {
      V3ChartConfig.yAxis.LabelShow = true
    } else if (typeof V3ChartConfig.yAxis.LabelShow == 'string') {
      V3ChartConfig.yAxis.LabelShow =
        V3ChartConfig.yAxis.LabelShow.toLowerCase() == 'true' ? true : false
    }

    //是否显示坐标轴轴线
    if (typeof V3ChartConfig.yAxis.LineShow == 'undefined') {
      V3ChartConfig.yAxis.LineShow = true
    } else if (typeof V3ChartConfig.yAxis.LineShow == 'string') {
      V3ChartConfig.yAxis.LineShow =
        V3ChartConfig.yAxis.LineShow.toLowerCase() == 'true' ? true : false
    }

    //是否显示坐标轴刻度
    if (typeof V3ChartConfig.yAxis.TickShow == 'undefined') {
      V3ChartConfig.yAxis.TickShow = true
    } else if (typeof V3ChartConfig.yAxis.TickShow == 'string') {
      V3ChartConfig.yAxis.TickShow =
        V3ChartConfig.yAxis.TickShow.toLowerCase() == 'true' ? true : false
    }
  }

  //组合图、双Y轴兼容旧配置
  if (typeof V3ChartConfig.serie.style != 'undefined') {
    if (typeof V3ChartConfig.serie.style.length == 'undefined') {
      V3ChartConfig.serie.style = [V3ChartConfig.serie.style]
    }
    for (let i = 0; i < V3ChartConfig.y.length; i++) {
      if (typeof V3ChartConfig.y[i].chartType == 'undefined') {
        if (V3ChartConfig.serie.style.length - 1 >= i) {
          V3ChartConfig.y[i].chartType = V3ChartConfig.serie.style[i].renderAs
        } else {
          V3ChartConfig.y[i].chartType = RandomChartType()
        }
      }
    }

    delete V3ChartConfig.serie.style
  }

  //双Y轴兼容旧配置
  if (typeof V3ChartConfig.serie.yAxis != 'undefined') {
    if (typeof V3ChartConfig.serie.yAxis.length == 'undefined') {
      V3ChartConfig.serie.yAxis = [V3ChartConfig.serie.yAxis]
    }

    for (let i = 0; i < V3ChartConfig.serie.yAxis.length; i++) {
      for (let j = 0; j < V3ChartConfig.y.length; j++) {
        if (V3ChartConfig.serie.yAxis[i].serieName == V3ChartConfig.y[j].name) {
          V3ChartConfig.y[j].yAxisIndex = V3ChartConfig.serie.yAxis[i].yAxis
        }
      }
    }
  }

  for (let i = 0; i < V3ChartConfig.y.length; i++) {
    //图表类型
    chartType = V3ChartConfig.chartType.toLowerCase()
    if (typeof V3ChartConfig.y[i].chartType != 'undefined') {
      chartType = V3ChartConfig.y[i].chartType.toLowerCase()
    }
    V3ChartConfig.y[i].chartType = chartType

    if (typeof V3ChartConfig.y[i].yAxisIndex == 'undefined') {
      V3ChartConfig.y[i].yAxisIndex = 0
    }
    V3ChartConfig.y[i].yAxisIndex = V3ChartConfig.y[i].yAxisIndex * 1

    //是否显示数值标签
    if (typeof V3ChartConfig.y[i].showlabel == 'undefined') {
      V3ChartConfig.y[i].showlabel = false
      if (getChartType(V3ChartConfig.y[i].chartType.toLowerCase()) == 'bar') {
        V3ChartConfig.y[i].showlabel = true
      }
    } else if (typeof V3ChartConfig.y[i].showlabel == 'string') {
      V3ChartConfig.y[i].showlabel =
        V3ChartConfig.y[i].showlabel.toLowerCase() == 'true' ? true : false
    }

    //数值标签显示位置
    if (typeof V3ChartConfig.y[i].position == 'undefined') {
      V3ChartConfig.y[i].position = 'top'

      if (getChartType(V3ChartConfig.y[i].chartType.toLowerCase()) == 'bar') {
        V3ChartConfig.y[i].position = 'inside'
      }
    } else if (V3ChartConfig.y[i].position == null) {
      V3ChartConfig.y[i].position = 'top'
    }

    //是否平滑曲线显示
    if (typeof V3ChartConfig.y[i].smooth == 'undefined') {
      V3ChartConfig.y[i].smooth = true
    } else if (typeof V3ChartConfig.y[i].smooth == 'string') {
      V3ChartConfig.y[i].smooth =
        V3ChartConfig.y[i].smooth.toLowerCase() == 'true' ? true : false
    }

    //标记的图形
    if (typeof V3ChartConfig.y[i].symbol == 'undefined') {
      V3ChartConfig.y[i].symbol = 'emptyCircle'
    }

    //气泡图
    if (chartType == 'bubble' || chartType == 'scatter') {
      V3ChartConfig.y[i].symbol = 'circle'
    }

    //是否连接空数据
    if (typeof V3ChartConfig.y[i].connectNulls == 'undefined') {
      V3ChartConfig.y[i].connectNulls = false
    } else if (typeof V3ChartConfig.y[i].connectNulls == 'string') {
      V3ChartConfig.y[i].connectNulls =
        V3ChartConfig.y[i].connectNulls.toLowerCase() == 'true' ? true : false
    }
  }
}

let V3ChartPalette = [
  [
    '#2ec7c9',
    '#b6a2de',
    '#5ab1ef',
    '#ffb980',
    '#d87a80',
    '#8d98b3',
    '#e5cf0d',
    '#97b552',
    '#95706d',
    '#dc69aa',
    '#07a2a4',
    '#9a7fd1',
    '#588dd5',
    '#f5994e',
    '#c05050',
    '#59678c',
    '#c9ab00',
    '#7eb00a',
    '#6f5553',
    '#c14089'
  ],
  [
    '#d62728',
    '#2ca02c',
    '#ff7f0e',
    '#1f77b4',
    '#9482bd',
    '#8c564b',
    '#aec7e8',
    '#ffbb78',
    '#98df8a',
    '#ff9896',
    '#c5b0d5',
    '#c49c94'
  ],
  [
    '#C1232B',
    '#27727B',
    '#FCCE10',
    '#E87C25',
    '#B5C334',
    '#FE8463',
    '#9BCA63',
    '#FAD860',
    '#F3A43B',
    '#60C0DD',
    '#D7504B',
    '#C6E579',
    '#F4E001',
    '#F0805A',
    '#26C0C0'
  ],
  [
    '#c12e34',
    '#e6b600',
    '#0098d9',
    '#2b821d',
    '#005eaa',
    '#339ca8',
    '#cda819',
    '#32a487'
  ],
  [
    '#d87c7c',
    '#919e8b',
    '#d7ab82',
    '#6e7074',
    '#61a0a8',
    '#efa18d',
    '#787464',
    '#cc7e63',
    '#724e58',
    '#4b565b'
  ]
]

//Echarts默认配饰
let DefauleEChartPalette = [
  '#c23531',
  '#2f4554',
  '#61a0a8',
  '#d48265',
  '#91c7ae',
  '#749f83',
  '#ca8622',
  '#bda29a',
  '#6e7074',
  '#546570',
  '#c4ccd3'
]

// 设置字体样式
function setFontStyle(V3ChartFontStyle: any) {
  var style = {
    // 颜色
    color: V3ChartFontStyle.fontColor,
    // 字体
    fontFamily: V3ChartFontStyle.font,
    // 字号
    fontSize: V3ChartFontStyle.fontSize,
    // 斜体:normal、italic、oblique
    fontStyle: V3ChartFontStyle.italic == '0' ? 'normal' : 'italic',
    // 加粗:normal、bold、bolder、lighter
    fontWeight: V3ChartFontStyle.bold == '0' ? 'normal' : 'bold'
  }
  return style
}

// 设置主、副标题
function setTitle(V3ChartConfig: any, option: any) {
  // 主标题
  option.title = {}

  option.title.show = V3ChartConfig.title.show // 是否显示
  option.title.left = V3ChartConfig.title.horizontal //横向位置
  option.title.top = V3ChartConfig.title.vertical //竖向位置

  option.title.itemGap = 0 // 主、副标题间距
  option.title.text = V3ChartConfig.title.title // 文字内容
  option.title.backgroundColor =
    V3ChartConfig.title.bgColor == null
      ? 'transparent'
      : V3ChartConfig.title.bgColor // 标题背景颜色
  option.title.textStyle = setFontStyle(V3ChartConfig.title) // 字体样式

  // 副标题
  option.title.subtext = V3ChartConfig.subtitle.title // 文字内容
  option.title.subtextStyle = setFontStyle(V3ChartConfig.subtitle) // 字体样式
}

// 仪表盘gauge
function setGaugeOption(V3ChartConfig: any, data: any, option: any) {
  setTitle(V3ChartConfig, option) // 主、副标题

  if (typeof option.grid != 'undefined') {
    delete option.grid
  }

  option.tooltip = {}
  option.tooltip.formatter = '{a}<br/>{c}'

  option.toolbox = {}
  option.toolbox.show = true
  option.toolbox.feature = {}
  option.toolbox.feature.saveAsImage = {}
  option.toolbox.feature.saveAsImage.show = false

  var RangeArea = [] // 最大最小值区间
  if (typeof V3ChartConfig.ranges != 'undefined') {
    if (typeof V3ChartConfig.ranges.length == 'undefined') {
      RangeArea.push(V3ChartConfig.ranges.min * 1)
      RangeArea.push(V3ChartConfig.ranges.max * 1)
    } else {
      for (let j = 0; j < V3ChartConfig.ranges.length; j++) {
        RangeArea.push(V3ChartConfig.ranges[j].min * 1)
        RangeArea.push(V3ChartConfig.ranges[j].max * 1)
      }
    }
  } else {
    RangeArea.push(0)
    RangeArea.push(100)
  }

  option.series = []
  for (let i = 0; i < V3ChartConfig.y.length; i++) {
    let series: { [key: string | number | symbol]: any } = {}
    series.name = V3ChartConfig.y[i].name
    series.code = V3ChartConfig.y[i].code
    series.type = 'gauge'

    series.startAngle = 180 // 仪表盘起始角度。圆心正右手侧为0度，正上方为90度，正左手侧为180度。default:225
    series.endAngle = 0 // 仪表盘结束角度。default: -45

    if (typeof V3ChartConfig.y[i].range != 'undefined') {
      RangeArea = []
      if (typeof V3ChartConfig.y[i].range.length == 'undefined') {
        RangeArea.push(V3ChartConfig.y[i].range.min * 1)
        RangeArea.push(V3ChartConfig.y[i].range.max * 1)
      } else {
        for (let j = 0; j < V3ChartConfig.y[i].range.length; j++) {
          RangeArea.push(V3ChartConfig.y[i].range[j].min * 1)
          RangeArea.push(V3ChartConfig.y[i].range[j].max * 1)
        }
      }
    }

    series.min = caclArrayMinValue(RangeArea)
    series.max = caclArrayMaxValue(RangeArea)

    option.series.push(series)
  }

  for (let i = 0; i < option.series.length; i++) {
    // 最多显示 3行 * 3 列 = 9个仪表盘
    let left = 50,
      top = 75,
      xRate = 0,
      Rate = 75

    if (option.series.length == 1) {
      left = 50
      top = 75
      xRate = 50
      Rate = 100
    } else if (option.series.length == 2) {
      xRate = 25
      Rate = 75
      top = 75
    } else if (option.series.length == 3) {
      xRate = 17
      Rate = 66
      top = 75
    } else if (option.series.length <= 6) {
      // 双行
      xRate = 17
      Rate = 33
      top = (Math.floor(i / 3) + 1) * 40
    } else if (option.series.length <= 9) {
      // 三行
      xRate = 17
      Rate = 33
      top = (Math.floor(i / 3) + 1) * 25
    }

    switch ((i + 1) % 3) {
      case 0:
        left = 100 - xRate
        break
      case 1:
        if (option.series.length > 1) left = xRate
        break
      case 2:
        if (i + 1 == option.series.length)
          // 特殊处理最后一项
          left = 100 - xRate
        else left = 50
        break
    }
    option.series[i].center = [left + '%', top + '%'] // 位置
    option.series[i].radius = Rate + '%'

    option.series[i].title = {} // 仪表盘标题
    option.series[i].title.textStyle = {}
    option.series[i].title.textStyle.fontWeight =
      V3ChartConfig.subtitle.fontWeight
    option.series[i].title.textStyle.fontSize = 9 //V3ChartConfig.subtitle.fontSize;
    option.series[i].title.offsetCenter = [0, '-40%']

    option.series[i].detail = {} // 仪表盘详情，用于显示数据。
    option.series[i].detail.show =
      V3ChartConfig.serie.showDetail == 'false' ? false : true // 添加功能是否显示详情，默认显示
    option.series[i].detail.textStyle = {}
    option.series[i].detail.textStyle.fontWeight =
      V3ChartConfig.subtitle.fontWeight
    option.series[i].detail.textStyle.fontSize = 9 //V3ChartConfig.subtitle.fontSize;
    option.series[i].detail.offsetCenter = [0, '20%']

    option.series[i].axisLine = {} // 坐标轴线
    option.series[i].axisLine.show = true // 默认显示，属性show控制显示与否
    option.series[i].axisLine.lineStyle = {} // 属性lineStyle控制线条样式
    option.series[i].axisLine.lineStyle.width = 9 //V3ChartConfig.subtitle.fontSize;

    let ColorArea = [] // 颜色区间
    if (typeof V3ChartConfig.ranges != 'undefined') {
      if (typeof V3ChartConfig.ranges.length == 'undefined') {
        // 单个颜色区间
        ColorArea.push([1, V3ChartConfig.ranges.color])
      } else {
        // 多个颜色区间
        for (let j = 0; j < V3ChartConfig.ranges.length; j++) {
          let ColorRate = V3ChartConfig.ranges[j].max * 1 - option.series[i].min
          ColorRate = Number(
            (ColorRate / (option.series[i].max - option.series[i].min)).toFixed(
              2
            )
          )
          ColorArea.push([ColorRate, V3ChartConfig.ranges[j].color])
        }
      }
    } else {
      if (typeof V3ChartConfig.y.length == 'undefined') {
        if (typeof V3ChartConfig.y.range != 'undefined') {
          if (typeof V3ChartConfig.y.range.length == 'undefined') {
            // 单个颜色区间
            ColorArea.push([1, V3ChartConfig.y.range.color])
          } else {
            // 多个颜色区间
            for (let j = 0; j < V3ChartConfig.y.range.length; j++) {
              let ColorRate =
                V3ChartConfig.y.range[j].max * 1 - option.series[i].min
              ColorRate = Number(
                (
                  ColorRate /
                  (option.series[i].max - option.series[i].min)
                ).toFixed(2)
              )
              ColorArea.push([ColorRate, V3ChartConfig.y.range[j].color])
            }
          }
        }
      } else {
        if (typeof V3ChartConfig.y[i].range != 'undefined') {
          if (typeof V3ChartConfig.y[i].range.length == 'undefined') {
            // 单个颜色区间
            ColorArea.push([1, V3ChartConfig.y[i].range.color])
          } else {
            // 多个颜色区间
            for (let j = 0; j < V3ChartConfig.y[i].range.length; j++) {
              let ColorRate =
                V3ChartConfig.y[i].range[j].max * 1 - option.series[i].min
              ColorRate = Number(
                (
                  ColorRate /
                  (option.series[i].max - option.series[i].min)
                ).toFixed(2)
              )
              ColorArea.push([ColorRate, V3ChartConfig.y[i].range[j].color])
            }
          }
        }
      }
    }
    if (ColorArea.length > 0)
      option.series[i].axisLine.lineStyle.color = ColorArea

    if (!data.recordCount) {
      return
    }

    option.series[i].data = [
      {
        value: data.values[0][option.series[i].code],
        name: option.series[i].name
      }
    ]
  }
}

// 预设图表样式
function getChartColor(ThemeIndex: any) {
  try {
    if (ThemeIndex == null || typeof ThemeIndex == 'undefined') ThemeIndex = 1
    ThemeIndex = ThemeIndex * 1

    if (ThemeIndex + 1 > V3ChartPalette.length)
      ThemeIndex = V3ChartPalette.length
    if (ThemeIndex <= 1) ThemeIndex = 1

    return V3ChartPalette[ThemeIndex - 1]
  } catch (e) {
    return [
      '#2ec7c9',
      '#b6a2de',
      '#5ab1ef',
      '#ffb980',
      '#d87a80',
      '#8d98b3',
      '#e5cf0d',
      '#97b552',
      '#95706d',
      '#dc69aa',
      '#07a2a4',
      '#9a7fd1',
      '#588dd5',
      '#f5994e',
      '#c05050',
      '#59678c',
      '#c9ab00',
      '#7eb00a',
      '#6f5553',
      '#c14089'
    ]
  }
}

// 设置坐标系网格 ：为了不遮挡文字内容，需要计算位置
function setGrid(V3ChartConfig: any, option: any) {
  // 左边距
  let leftGap: string | number = 'auto'
  if (
    typeof V3ChartConfig.xAxis != 'undefined' &&
    (V3ChartConfig.chartType.toLowerCase() == 'combidy' ||
      V3ChartConfig.chartType.toLowerCase() == 'radar' ||
      V3ChartConfig.chartType.toLowerCase() == 'pie' ||
      V3ChartConfig.chartType.toLowerCase() == 'dough' ||
      (V3ChartConfig.yAxis.Title != null && V3ChartConfig.yAxis.Title != ''))
  ) {
    leftGap = 25 //V3ChartConfig.yAxis.fontSize * 3;
  }

  //右边距
  let rightGap = 25

  // 上边距
  let topGap = 45 // 主副标题间距5

  // 下边距
  let bottomGap = 40 //V3ChartConfig.xAxis.fontSize * 3; // x轴 + 图例
  if (
    typeof V3ChartConfig.xAxis != 'undefined' &&
    V3ChartConfig.xAxis.Title != null &&
    V3ChartConfig.xAxis.Title != ''
  ) {
    bottomGap = 50 //V3ChartConfig.xAxis.fontSize * 4;
  }

  //上边距
  if (typeof V3ChartConfig.inCanvas.top != 'undefined')
    topGap = V3ChartConfig.inCanvas.top * 1

  //下边距
  if (typeof V3ChartConfig.inCanvas.bottom != 'undefined')
    bottomGap = V3ChartConfig.inCanvas.bottom * 1

  //左边距
  if (typeof V3ChartConfig.inCanvas.left != 'undefined')
    leftGap = V3ChartConfig.inCanvas.left * 1

  //右边距
  if (typeof V3ChartConfig.inCanvas.right != 'undefined')
    rightGap = V3ChartConfig.inCanvas.right * 1

  option.grid = {}
  // grid 组件离容器左侧的距离。default: 'auto'
  option.grid.left = leftGap
  // grid 组件离容器右侧的距离。default: '10%'
  option.grid.right = rightGap
  // grid 组件离容器上侧的距离。default: 60
  option.grid.top = topGap
  // grid 组件离容器下侧的距离。default: 60
  option.grid.bottom = bottomGap
  // grid 组件的宽度。默认自适应。 default: 'auto'
  option.grid.width = 'auto'
  // grid 组件的高度。默认自适应。default: 'auto'
  option.grid.height = 'auto'
  // grid区域是否包含坐标轴的刻度标签，在无法确定坐标轴标签的宽度，
  // 容器有比较小无法预留较多空间的时候，可以设为 true防止标签溢出容器。
  option.grid.containLabel = true

  //背景颜色
  option.grid.backgroundColor =
    V3ChartConfig.inCanvas.bgColor == null
      ? 'transparent'
      : V3ChartConfig.inCanvas.bgColor
  option.backgroundColor =
    V3ChartConfig.outCanvas.bgColor == null
      ? 'transparent'
      : V3ChartConfig.outCanvas.bgColor
  option.grid.show = option.grid.backgroundColor != 'transparent'
}

// 设置工具栏
function setToolbox(option: any) {
  option.toolbox = {}
  // 是否显示工具栏组件
  option.toolbox.show = false
  // 工具栏 icon 的布局朝向
  // 可选:horizontal=横向、vertical=纵向
  option.toolbox.orient = 'horizontal'
  // 工具栏 icon 的大小。
  option.toolbox.itemSize = 15
  // 工具栏 icon 每项之间的间隔。
  // 横向布局时为水平间隔，纵向布局时为纵向间隔。
  option.toolbox.itemGap = 10
  // 是否在鼠标 hover 的时候显示每个工具 icon 的标题。
  option.toolbox.showTitle = true

  // 工具栏组件离容器左侧的距离。
  // left 的值可以是像 20 这样的具体像素值，
  // 可以是像 '20%' 这样相对于容器高宽的百分比，
  // 也可以是 'left', 'center', 'right'。
  option.toolbox.left = 'center'
  option.toolbox.top = option.grid.top

  // 各工具配置项
  option.toolbox.feature = {}
  // 数据区域缩放
  option.toolbox.feature.dataZoom = {
    show: true
  }
  // 配置项还原
  option.toolbox.feature.restore = {
    show: true
  }
  // 动态切换图表 类型
  option.toolbox.feature.magicType = {
    show: true
  }
  // 启用的动态类型，包括'line'（切换为折线图）, 'bar'（切换为柱状图）, 'stack'（切换为堆叠模式）,
  // 'tiled'（切换为平铺模式）。
  option.toolbox.feature.magicType.type = ['line', 'bar', 'stack', 'tiled']
  // 查看数据
  option.toolbox.feature.dataView = {
    show: true,
    readOnly: true
  }
  // 保存为图片
  option.toolbox.feature.saveAsImage = {
    show: true
  }

  // 自定义按钮及事件
  // 注意，自定义的工具名字，只能以 my 开头
  // option.toolbox.feature.myTool2 = {
  // show : true,
  // title : '自定义扩展方法',
  // icon : 'image://http://echarts.baidu.com/images/favicon.png',
  // onclick : function() {
  // alert('myToolHandler2')
  // }
  // }
}

// 提示框
function setTooltip(V3ChartConfig: any, option: any) {
  option.tooltip = {}
  option.tooltip.show = true
  option.tooltip.confine = true

  // formatter 提示框浮层内容格式器，支持字符串模板和回调函数两种形式。
  // 字符串模板。
  // 模板变量有 {a}, {b}，{c}，{d}，{e}，分别表示系列名，数据名，数据值等。
  // 在 trigger 为 'axis' 的时候，会有多个系列的数据，此时可以通过 {a0}, {a1}, {a2}
  // 这种后面加索引的方式表示系列的索引。
  // 不同图表类型下的 {a}，{b}，{c}，{d} 含义不一样。
  // 其中变量{a}, {b}, {c}, {d}在不同图表类型下代表数据含义为：
  // 折线（区域）图、柱状（条形）图、K线图 : {a}（系列名称），{b}（类目值），{c}（数值）, {d}（无）
  // 散点图（气泡）图 : {a}（系列名称），{b}（数据名称），{c}（数值数组）, {d}（无）
  // 地图 : {a}（系列名称），{b}（区域名称），{c}（合并数值）, {d}（无）
  // 饼图、仪表盘、漏斗图: {a}（系列名称），{b}（数据项名称），{c}（数值）, {d}（百分比）

  // axisPointer 坐标轴指示器配置项，在 trigger 为 'axis' 时有效。
  // 'line' 直线指示器
  // 'cross' 十字准星指示器
  // 'shadow' 阴影指示器

  option.tooltip.axisPointer = {}

  // axisPointer.type 触发类型
  // 'item'数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。
  // 'axis'坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用。

  if (
    V3ChartConfig.chartType.toLowerCase() == 'pie' ||
    V3ChartConfig.chartType.toLowerCase() == 'rose' ||
    V3ChartConfig.chartType.toLowerCase() == 'dough'
  ) {
    option.tooltip.axisPointer.trigger = 'item'
    option.tooltip.formatter = '{a} <br/>{b}: {c} ({d}%)'
  } else {
    option.tooltip.trigger = 'axis'
    if (V3ChartConfig.chartType.toLowerCase() == 'scatter') {
      // 散点图
      option.tooltip.axisPointer.type = 'cross'
    } else {
      option.tooltip.axisPointer.type = 'shadow'
    }
  }
}

// 图例
function setLegend(V3ChartConfig: any, option: any) {
  option.legend = {}
  option.legend.show = V3ChartConfig.serie.show // 是否显示
  option.legend.align = 'left'
  option.legend.left = V3ChartConfig.serie.horizontal //横向位置
  option.legend.top = V3ChartConfig.serie.vertical //竖向位置
  option.legend.orient = V3ChartConfig.serie.orient //图例排列方向
  //option.legend.itemHeight = V3ChartConfig.outCanvas.fontSize;
  option.legend.textStyle = {}
  //option.legend.textStyle = setFontStyle(V3ChartConfig.xAxis);
  option.legend.textStyle.fontSize = V3ChartConfig.outCanvas.fontSize
  option.legend.itemGap = V3ChartConfig.serie.itemGap //图例每项之间的间隔。横向布局时为水平间隔，纵向布局时为纵向间隔。

  option.legend.formatter = function (name: any) {
    return echarts.format.truncateText(
      name,
      100,
      '14px Microsoft Yahei',
      '',
      {}
    )
  }

  option.legend.tooltip = {}
  option.legend.tooltip.show = true
}

// 直角坐标系 grid 中的 x 轴
// 单个 grid 组件最多只能放上下两个 x 轴。
function setxAxis(V3ChartConfig: any, option: any) {
  option.xAxis = {}
  option.xAxis.z = 2

  // 坐标轴类型。
  // 'value' 数值轴，适用于连续数据。
  // 'category' 类目轴，适用于离散的类目数据，
  // 为该类型时必须通过 data 设置类目数据。
  // 'time' 时间轴，适用于连续的时序数据，与数值轴相比时间轴带有时间的格式化，
  // 在刻度计算上也有所不同，例如会根据跨度的范围来决定使用月，星期，日还是小时范围的刻度。
  // 'log' 对数轴。适用于对数数据。
  option.xAxis.type = 'category'
  //强制不包含零刻度
  option.xAxis.scale = V3ChartConfig.xAxis.scale
  // 坐标轴名称。
  option.xAxis.name = ''
  // 坐标轴两边留白策略
  option.xAxis.boundaryGap = V3ChartConfig.xAxis.boundaryGap

  // 坐标轴轴线相关设置。
  option.xAxis.axisLine = {}
  // 是否显示坐标轴轴线
  option.xAxis.axisLine.show = V3ChartConfig.xAxis.LineShow

  // 坐标轴刻度相关设置。
  option.xAxis.axisTick = {}
  // 是否显示坐标轴刻度。
  option.xAxis.axisTick.show = V3ChartConfig.xAxis.TickShow
  // 类目轴中在 boundaryGap 为 true 的时候有效，可以保证刻度线和标签对齐
  option.xAxis.axisTick.alignWithLabel = V3ChartConfig.xAxis.alignWithLabel
  // 坐标轴刻度的显示间隔，在类目轴中有效
  // 默认会采用标签不重叠的策略间隔显示标签。
  // 可以设置成 0 强制显示所有标签。
  option.xAxis.axisTick.interval = 'auto'

  //option.xAxis.splitArea = {};
  //option.xAxis.splitArea.show = false;

  let Axis = V3ChartConfig.xAxis // 纵向
  // 坐标轴名称与轴线之间的距离
  option.xAxis.nameGap = Axis.nameGap //Axis.fontSize * 2.5;

  let chartType = V3ChartConfig.chartType.toLowerCase()

  if (chartType == 'bar' || chartType == 'stackbar') {
    Axis = V3ChartConfig.yAxis
    option.xAxis.type = 'value'
    option.xAxis.boundaryGap = ['0%', '10%'] // 坐标轴两边留白策略
    //option.xAxis.splitArea.show = true;
  }

  if (chartType == 'bubble' || chartType == 'scatter') {
    option.xAxis.boundaryGap = ['0%', '10%'] // 坐标轴两边留白策略
  }

  if (
    chartType == 'column' ||
    chartType == 'stack' ||
    chartType == 'stackcolumn' ||
    chartType == 'combidy' ||
    chartType == 'combination'
  ) {
    option.xAxis.boundaryGap = true // 坐标轴两边留白策略
  }

  // 坐标轴名称显示位置。start、middle、end
  option.xAxis.nameLocation = Axis.nameLocation
  //X坐标轴标题的名称样式（为x轴设置的样式）
  option.xAxis.nameTextStyle = setFontStyle(Axis)
  //option.xAxis.nameTextStyle.fontSize = 9; //V3ChartConfig.outCanvas.fontSize;

  // x坐标轴刻度标签的相关设置。
  option.xAxis.axisLabel = {}
  // 是否显示坐标轴标题
  option.xAxis.axisLabel.show = Axis.LabelShow

  // 刻度标签旋转的角度，在类目轴的类目标签显示不下的时候可以通过旋转防止标签之间重叠。
  // 旋转的角度从 -90 度到 90 度。
  // Axis.slantLabels 0横向 1倾斜 2纵向
  option.xAxis.axisLabel.rotate = Axis.slantLabels * 45
  // x轴值的字体样式 (为外画布设置的值)
  option.xAxis.axisLabel.textStyle = setFontStyle(V3ChartConfig.outCanvas) //setFontStyle(Axis);
  //option.xAxis.axisLabel.fontSize = 9; //V3ChartConfig.outCanvas.fontSize;
  //显示所有x轴标签
  option.xAxis.axisLabel.interval = '0'
  //标签过长时转行处理
  option.xAxis.axisLabel.formatter = function (params: any) {
    if (Axis.labelDisplay == 'WRAP') {
      params = params + '' // 参数是String格式
      if (params && params.length > 0) {
        let newParamsName = '' // 最终拼接成的字符串
        let paramsNameNumber = params.length // 实际标签的个数
        let provideNumber = 4 // 每行能显示的字的个数
        let rowNumber = Math.ceil(paramsNameNumber / provideNumber) // 换行的话，需要显示几行，向上取整
        /**
         * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
         */
        // 条件等同于rowNumber>1
        if (paramsNameNumber > provideNumber) {
          /** 循环每一行,p表示行 */
          for (let p = 0; p < rowNumber; p++) {
            let tempStr = '' // 表示每一次截取的字符串
            let start = p * provideNumber // 开始截取的位置
            let end = start + provideNumber // 结束截取的位置
            // 此处特殊处理最后一行的索引值
            if (p == rowNumber - 1) {
              // 最后一次不换行
              tempStr = params.substring(start, paramsNameNumber)
            } else {
              // 每一次拼接字符串并换行
              tempStr = params.substring(start, end) + '\n'
            }
            newParamsName += tempStr // 最终拼成的字符串
          }
        } else {
          // 将旧标签的值赋给新标签
          newParamsName = params
        }
        //将最终的字符串返回
        return newParamsName
      }
    } else {
      return params
    }
  }

  if (Axis.Title != null && Axis.Title != '') {
    option.xAxis.name = Axis.Title
  }
}

// 直角坐标系 grid 中的 y 轴
// 一般情况下单个 grid 组件最多只能放左右两个 y 轴，
// 多于两个 y 轴需要通过配置offset属性防止同个位置多个 Y 轴的重叠。
function setyAxis(V3ChartConfig: any, option: any) {
  var yAxis: { [key: string | number | symbol]: any } = {}
  yAxis.z = 2

  // 坐标轴类型。
  // 'value' 数值轴，适用于连续数据。
  // 'category' 类目轴，适用于离散的类目数据，
  // 为该类型时必须通过 data 设置类目数据。
  // 'time' 时间轴，适用于连续的时序数据，与数值轴相比时间轴带有时间的格式化，
  // 在刻度计算上也有所不同，例如会根据跨度的范围来决定使用月，星期，日还是小时范围的刻度。
  // 'log' 对数轴。适用于对数数据。
  yAxis.type = 'value'
  yAxis.scale = V3ChartConfig.yAxis.scale

  // 坐标轴两边留白策略
  yAxis.boundaryGap = ['0%', '10%']

  // 坐标轴轴线相关设置。
  yAxis.axisLine = {}
  // 是否显示坐标轴轴线
  yAxis.axisLine.show = V3ChartConfig.yAxis.LineShow

  // 坐标轴刻度相关设置。
  yAxis.axisTick = {}
  // 是否显示坐标轴刻度。
  yAxis.axisTick.show = V3ChartConfig.yAxis.TickShow
  // 类目轴中在 boundaryGap 为 true 的时候有效，可以保证刻度线和标签对齐
  yAxis.axisTick.alignWithLabel = true
  // 坐标轴刻度的显示间隔，在类目轴中有效
  // 默认会采用标签不重叠的策略间隔显示标签。
  // 可以设置成 0 强制显示所有标签。
  yAxis.axisTick.interval = 'auto'

  //yAxis.splitArea = {};
  //yAxis.splitArea.show = true;

  var Axis = V3ChartConfig.yAxis // 纵向
  // 坐标轴名称与轴线之间的距离
  yAxis.nameGap = Axis.nameGap //Axis.fontSize * 2.5;

  let chartType = V3ChartConfig.chartType.toLowerCase()
  if (chartType == 'bar' || chartType == 'stackbar') {
    // 横向
    Axis = V3ChartConfig.xAxis
    yAxis.type = 'category'
    yAxis.boundaryGap = true // 坐标轴两边留白策略
    //yAxis.splitArea.show = false;
  }

  // 坐标轴名称。
  yAxis.name = ''

  // 坐标轴名称显示位置。start、middle、end
  yAxis.nameLocation = Axis.nameLocation
  //y坐标轴标题的名称样式（为y轴设置的样式）
  yAxis.nameTextStyle = setFontStyle(Axis)
  //yAxis.nameTextStyle.fontSize = 9; //V3ChartConfig.outCanvas.fontSize;

  // x坐标轴刻度标签的相关设置。
  yAxis.axisLabel = {}
  // 是否显示坐标轴标题
  yAxis.axisLabel.show = Axis.LabelShow

  // 刻度标签旋转的角度，在类目轴的类目标签显示不下的时候可以通过旋转防止标签之间重叠。
  // 旋转的角度从 -90 度到 90 度。
  // Axis.slantLabels 0横向 1倾斜 2纵向
  yAxis.axisLabel.rotate = Axis.slantLabels * 45
  //y轴字体样式(为外画布的值)
  yAxis.axisLabel.textStyle = setFontStyle(V3ChartConfig.outCanvas) //setFontStyle(Axis);
  //yAxis.axisLabel.fontSize = 9; //V3ChartConfig.outCanvas.fontSize;
  //显示所有y轴标签
  yAxis.axisLabel.interval = '0'
  //y轴标签过长时转行处理
  yAxis.axisLabel.formatter = function (params: any) {
    if (Axis.labelDisplay == 'WRAP') {
      let newParamsName = '' // 最终拼接成的字符串
      let paramsNameNumber = params.length // 实际标签的个数
      let provideNumber = 4 // 每行能显示的字的个数
      let rowNumber = Math.ceil(paramsNameNumber / provideNumber) // 换行的话，需要显示几行，向上取整
      /**
       * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
       */
      // 条件等同于rowNumber>1
      if (paramsNameNumber > provideNumber) {
        /** 循环每一行,p表示行 */
        for (let p = 0; p < rowNumber; p++) {
          let tempStr = '' // 表示每一次截取的字符串
          let start = p * provideNumber // 开始截取的位置
          let end = start + provideNumber // 结束截取的位置
          // 此处特殊处理最后一行的索引值
          if (p == rowNumber - 1) {
            // 最后一次不换行
            tempStr = params.substring(start, paramsNameNumber)
          } else {
            // 每一次拼接字符串并换行
            tempStr = params.substring(start, end) + '\n'
          }
          newParamsName += tempStr // 最终拼成的字符串
        }
      } else {
        // 将旧标签的值赋给新标签
        newParamsName = params
      }
      //将最终的字符串返回
      return newParamsName
    } else {
      return params
    }
  }

  if (Axis.Title != null && Axis.Title != '') {
    yAxis.name = Axis.Title
  }

  if (V3ChartConfig.chartType.toLowerCase() != 'combidy') {
    // 双y轴
    option.yAxis = yAxis
    return
  }

  let yAxisList = [],
    List = []
  if (V3ChartConfig.chartType.toLowerCase() == 'combidy') {
    // 双y轴
    for (let i = 0; i < V3ChartConfig.y.length; i++) {
      let yAxisIndex =
        V3ChartConfig.y[i]['yAxisIndex'] == null
          ? 0
          : V3ChartConfig.y[i]['yAxisIndex'] * 1

      if (List.indexOf(yAxisIndex) == -1) {
        List.push(yAxisIndex)
        yAxisList.push(cloneObject(yAxis))

        yAxisList[yAxisList.length - 1].name =
          V3ChartConfig.y[i].name == null ? '' : V3ChartConfig.y[i].name // 坐标轴名称。
        yAxisList[yAxisList.length - 1].boundaryGap = ['0%', '10%']

        if (yAxisIndex >= 1) {
          yAxisList[yAxisList.length - 1].position = 'right' // 靠右

          // 多于两个 y 轴需要通过配置offset属性防止同个位置多个 Y 轴的重叠。
          yAxisList[yAxisList.length - 1].offset = 60 * (yAxisIndex - 1)
        }
      }
    }

    if (V3ChartConfig.yAxis.Title != null && V3ChartConfig.yAxis.Title != '') {
      yAxisList[0].name = V3ChartConfig.yAxis.Title
    }
    option.yAxis = yAxisList
  }
}

// 克隆对象
function cloneObject(SourceObj: any) {
  if (typeof SourceObj != 'object') return SourceObj
  if (SourceObj == null) return SourceObj

  let NewObj: { [key: string | number | symbol]: any } = new Object()
  for (let i in SourceObj) NewObj[i] = cloneObject(SourceObj[i])
  return NewObj
}

// 图表基本设置
function setBaseOption(V3ChartConfig: any, V3Data: any, option: any) {
  // 主、副标题
  setTitle(V3ChartConfig, option)
  // 网格
  setGrid(V3ChartConfig, option)
  // 工具栏
  //setToolbox(option)
  // 提示框
  setTooltip(V3ChartConfig, option)
  // 图例
  setLegend(V3ChartConfig, option)
  // x轴
  if (typeof V3ChartConfig.xAxis != 'undefined') setxAxis(V3ChartConfig, option)
  // y轴
  if (typeof V3ChartConfig.yAxis != 'undefined') setyAxis(V3ChartConfig, option)
}

// 设置图例数据
function setLegendData(V3ChartConfig: any, V3Data: any, option: any) {
  // 动态图例
  if (typeof option.legend == 'undefined') option.legend = {}
  option.legend.data = []

  let FieldName = '',
    FieldDesc = '',
    chartType = V3ChartConfig.chartType.toLowerCase(),
    Legend = []

  if (V3ChartConfig.serie.value != null) {
    FieldName = V3ChartConfig.serie.value
    option.legend.FieldName = FieldName

    for (let i = 0; i < V3Data.values.length; i++) {
      FieldDesc = V3Data.values[i][FieldName]
      if (Legend.indexOf(FieldDesc) == -1) {
        Legend.push(FieldDesc)
      }
    }
  }

  //自定义水平轴
  if (V3ChartConfig.x.value == null && V3ChartConfig.x.values != null) {
    for (let i = 0; i < Legend.length; i++) {
      FieldDesc = Legend[i]
      //FieldDesc = StringWrap(FieldDesc);
      option.legend.data.push(FieldDesc)

      let j = 0
      if (V3ChartConfig.y.length > i) j = i

      option.series.push({
        name: FieldDesc,
        FieldName: FieldDesc,
        chartType: chartType,
        type: getChartType(chartType),
        yAxisIndex: V3ChartConfig.y[j].yAxisIndex,
        showlabel: V3ChartConfig.y[j].showlabel,
        position: V3ChartConfig.y[j].position,
        smooth: V3ChartConfig.y[j].smooth,
        symbol: V3ChartConfig.y[j].symbol,
        connectNulls: V3ChartConfig.y[j].connectNulls,
        data: []
      })
    }

    //组合图、双Y轴兼容旧配置
    if (typeof V3ChartConfig.serie.style != 'undefined') {
      for (let i = 0; i < option.series.length; i++) {
        if (V3ChartConfig.serie.style.length - 1 >= i) {
          option.series[i].type =
            V3ChartConfig.serie.style[i].renderAs.toLowerCase()
        } else {
          option.series[i].type = RandomChartType()
        }
      }
    }

    return
  }

  // 数据项
  for (let i = 0; i < V3ChartConfig.y.length; i++) {
    FieldName = V3ChartConfig.y[i].code
    chartType = V3ChartConfig.y[i].chartType

    if (Legend.length > 0) {
      for (let j = 0; j < Legend.length; j++) {
        if (V3ChartConfig.y.length > 1) {
          FieldDesc =
            V3ChartConfig.y[i].name == null || V3ChartConfig.y[i].name == ''
              ? V3ChartConfig.y[i].code
              : V3ChartConfig.y[i].name
          FieldDesc = Legend[j] + '\n' + FieldDesc
        } else {
          FieldDesc = Legend[j]
        }
        //FieldDesc = StringWrap(FieldDesc);

        if (option.legend.data.indexOf(FieldDesc) == -1) {
          option.legend.data.push(FieldDesc)

          option.series.push({
            name: FieldDesc,
            FieldName: FieldName,
            chartType: V3ChartConfig.y[i].chartType,
            type: getChartType(V3ChartConfig.y[i].chartType),
            yAxisIndex: V3ChartConfig.y[i].yAxisIndex,
            showlabel: V3ChartConfig.y[i].showlabel,
            position: V3ChartConfig.y[i].position,
            smooth: V3ChartConfig.y[i].smooth,
            symbol: V3ChartConfig.y[i].symbol,
            connectNulls: V3ChartConfig.y[i].connectNulls,
            data: []
          })
        }
      }
    } else {
      FieldDesc =
        V3ChartConfig.y[i].name == null || V3ChartConfig.y[i].name == ''
          ? V3ChartConfig.y[i].code
          : V3ChartConfig.y[i].name

      if (option.legend.data.indexOf(FieldDesc) == -1) {
        //FieldDesc = StringWrap(FieldDesc);
        option.legend.data.push(FieldDesc)

        option.series.push({
          name: FieldDesc,
          FieldName: FieldName,
          chartType: V3ChartConfig.y[i].chartType,
          type: getChartType(V3ChartConfig.y[i].chartType),
          yAxisIndex: V3ChartConfig.y[i].yAxisIndex,
          showlabel: V3ChartConfig.y[i].showlabel,
          position: V3ChartConfig.y[i].position,
          smooth: V3ChartConfig.y[i].smooth,
          symbol: V3ChartConfig.y[i].symbol,
          connectNulls: V3ChartConfig.y[i].connectNulls,
          data: []
        })
      }
    }
  }

  //组合图、双Y轴兼容旧配置
  if (typeof V3ChartConfig.serie.style != 'undefined') {
    for (let i = 0; i < option.series.length; i++) {
      if (V3ChartConfig.serie.style.length - 1 >= i) {
        option.series[i].chartType =
          V3ChartConfig.serie.style[i].renderAs.toLowerCase()
      } else {
        option.series[i].chartType = RandomChartType()
      }
      option.series[i].type = getChartType(option.series[i].chartType)
    }
  }
}

// 设置x轴数据
function setAxisData(V3ChartConfig: any, V3Data: any, option: any) {
  let AxisData = option.legend.data,
    Value = ''

  if (V3ChartConfig.x.value != null) {
    AxisData = []
    for (let i = 0; i < V3Data.values.length; i++) {
      Value = V3Data.values[i][V3ChartConfig.x.value]
      if (AxisData.indexOf(Value) == -1) {
        AxisData.push(Value)
      }
    }
  }

  //自定义水平轴
  if (V3ChartConfig.x.value == null && V3ChartConfig.x.values != null) {
    AxisData = []
    for (let i = 0; i < V3ChartConfig.x.values.length; i++) {
      Value = V3ChartConfig.x.values[i].value
      Value = Value.replace('\n', '')
      Value = Value.replace('\r', '')
      if (AxisData.indexOf(Value) == -1) {
        AxisData.push(Value)
      }
    }
  }

  //特殊处理动态图例与横轴相同的情况
  if (
    V3ChartConfig.serie.value != null &&
    V3ChartConfig.x.value != null &&
    V3ChartConfig.serie.value.toLowerCase() ==
      V3ChartConfig.x.value.toLowerCase()
  ) {
    AxisData = []
    option.tooltip.trigger = 'item'
  }

  // 横柱图、横向折叠柱图
  let chartType = V3ChartConfig.chartType.toLowerCase()
  if (chartType == 'bar' || chartType == 'stackbar') {
    if (typeof option.yAxis == 'undefined') option.yAxis = {}
    option.yAxis.data = AxisData
    option.xAxis.nameGap = V3ChartConfig.yAxis.nameGap * 1
    option.yAxis.nameGap = V3ChartConfig.xAxis.nameGap * 1
  } else {
    if (typeof option.xAxis == 'undefined') option.xAxis = {}
    option.xAxis.data = AxisData
  }
}

// 设置图表数据
function setSeriesData(V3ChartConfig: any, V3Data: any, option: any) {
  // 横柱图、横向折叠柱图
  let AxisData = [],
    chartType = V3ChartConfig.chartType.toLowerCase()

  if (chartType == 'bar' || chartType == 'stackbar') {
    AxisData = option.yAxis.data
  } else {
    AxisData = option.xAxis.data
  }

  if (V3ChartConfig.serie.value != V3ChartConfig.x.value) {
    for (let i = 0; i < option.series.length; i++) {
      option.series[i].data = new Array(AxisData.length)
    }
  }

  // 填充y轴数据
  let FieldDesc = ''

  for (let i = 0; i < V3Data.values.length; i++) {
    for (let j = 0; j < option.series.length; j++) {
      if (option.legend.FieldName) {
        // 动态图例
        if (V3ChartConfig.x.value == null && V3ChartConfig.x.values != null) {
          if (
            option.series[j].name == V3Data.values[i][option.legend.FieldName]
          ) {
            for (let k = 0; k < V3ChartConfig.y.length; k++) {
              option.series[j].data[k] =
                V3Data.values[i][V3ChartConfig.y[k].code]
            }
          }
        } else {
          for (let k = 0; k < V3ChartConfig.y.length; k++) {
            if (V3ChartConfig.y.length > 1) {
              FieldDesc = `${V3Data.values[i][option.legend.FieldName]}'\n'${
                V3ChartConfig.y[k].name
              }`
            } else {
              FieldDesc = V3Data.values[i][option.legend.FieldName]
            }
            //FieldDesc = StringWrap(FieldDesc);
            if (option.series[j].name == FieldDesc) {
              if (V3ChartConfig.serie.value == V3ChartConfig.x.value) {
                option.series[j].data.push(
                  V3Data.values[i][option.series[j].FieldName]
                )
              } else {
                option.series[j].data[
                  AxisData.indexOf(V3Data.values[i][V3ChartConfig.x.value])
                ] = V3Data.values[i][option.series[j].FieldName]
              }
            }
          }
        }
      } else if (chartType != 'funnel') {
        if (V3ChartConfig.serie.value == V3ChartConfig.x.value) {
          option.series[i].data.push(
            V3Data.values[i][option.series[j].FieldName]
          )
        } else {
          option.series[j].data[
            AxisData.indexOf(V3Data.values[i][V3ChartConfig.x.value])
          ] = V3Data.values[i][option.series[j].FieldName]
        }
      }
    }
  }
}

// 设置图表基础样式
function setSeriesStyle(V3ChartConfig: any, option: any) {
  let chartType = V3ChartConfig.chartType.toLowerCase(),
    iColor = 0

  for (let i = 0; i < option.series.length; i++) {
    if (typeof option.series[i].label == 'undefined')
      option.series[i].label = {}

    if (typeof option.series[i].label.normal == 'undefined')
      option.series[i].label.normal = {}

    //特殊处理动态图例与横轴相同的情况
    if (
      V3ChartConfig.serie.value != null &&
      V3ChartConfig.x.value != null &&
      V3ChartConfig.serie.value.toLowerCase() ==
        V3ChartConfig.x.value.toLowerCase()
    ) {
      option.series[i].label.normal.formatter = '{a}{c}'
    }

    // option.series[i].label.normal.textStyle = {};
    // option.series[i].label.normal.textStyle.fontSize =
    // V3ChartConfig.xAxis.fontSize;
    // option.series[i].label.normal.textStyle.fontWeight =
    // V3ChartConfig.xAxis.bold == "0" ? 'normal'
    // : 'bold';
    //
    // // 标签内容格式器，支持字符串模板和回调函数两种形式，
    // // 字符串模板与回调函数返回的字符串均支持用 \n 换行。
    // // 模板变量有 {a}、{b}、{c}，分别表示系列名，数据名，数据值。
    // if ((V3ChartConfig.xAxis.Title != null) &&
    // (V3ChartConfig.xAxis.Title !=
    // '')) {
    // option.series[i].label.normal.formatter = ' {b}: {c} '
    // + V3ChartConfig.xAxis.Title;
    // }
    //
    // 区域图
    if (chartType == 'area' && option.series[i].type.toLowerCase() == 'line') {
      option.series[i].areaStyle = {}
      option.series[i].areaStyle.normal = {}

      //渐变色
      if (V3ChartConfig.yAxis && V3ChartConfig.yAxis.isGradientColor) {
        iColor = i <= option.color.length ? i : i % option.color.length
        //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
        option.series[i].areaStyle.normal.color =
          new echarts.graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              {
                offset: 0,
                color: option.color[iColor]
              },
              {
                offset: 1,
                color: 'rgba(0,0,0, 0)'
              }
            ],
            false
          )
      }
    }

    //折叠图
    if (chartType.indexOf('stack') >= 0) {
      option.series[i].type = 'bar'

      if (typeof V3ChartConfig.StackGroup != 'undefined') {
        let StackIndex = -1
        for (let j = 0; j < V3ChartConfig.StackGroup.length; j++) {
          StackIndex = V3ChartConfig.StackGroup[j].indexOf(
            option.series[i].FieldName
          )
          if (StackIndex > -1) {
            option.series[i].stack = '' + j
            break
          }
        }
      } else {
        option.series[i].stack = 'stack'
      }
    }

    //双Y轴
    if (chartType == 'combidy' && option.series[i].type == 'bar') {
      if (typeof V3ChartConfig.StackGroup != 'undefined') {
        let StackIndex = -1
        for (let j = 0; j < V3ChartConfig.StackGroup.length; j++) {
          StackIndex = V3ChartConfig.StackGroup[j].indexOf(
            option.series[i].FieldName
          )
          if (StackIndex > -1) {
            option.series[i].stack = '' + j
            break
          }
        }
      }
    }

    option.series[i].label.normal.show = option.series[i].showlabel //显示数值
    option.series[i].label.normal.position = option.series[i].position // 显示数值位置
    option.series[i].label.normal.textStyle = setFontStyle(
      V3ChartConfig.inCanvas
    ) //显示数值的标签样式（为内画布设置的值）

    if (option.series[i].type == 'line') {
      option.series[i].smooth = option.series[i].smooth // 平滑
    }

    if (option.series[i].type == 'bar') {
      //柱条的最大宽度
      if (typeof V3ChartConfig.serie.barMaxWidth != 'undefined') {
        if (typeof V3ChartConfig.serie.barMaxWidth == 'string') {
          option.series[i].barMaxWidth = V3ChartConfig.serie.barMaxWidth + '%' //柱条的最大宽度
        }
      }
    }
  }
}

// 图表基础数据项
function setSeriesOption(V3ChartConfig: any, V3Data: any, option: any) {
  if (typeof option.series == 'undefined') option.series = {}
  option.series = []

  // 设置图例数据
  setLegendData(V3ChartConfig, V3Data, option)

  // 设置x轴数据
  setAxisData(V3ChartConfig, V3Data, option)

  // 设置图表数据
  setSeriesData(V3ChartConfig, V3Data, option)

  // 设置图表基础样式
  setSeriesStyle(V3ChartConfig, option)
}

// 气泡图设置
function setBubbleOption(option: any) {
  option.tooltip = {}
  let Max = option.series[0].data[0],
    Min = option.series[0].data[0]

  for (let i = 0; i < option.series.length; i++) {
    for (let j = 0; j < option.series[i].data.length; j++) {
      Max = Math.max(
        Max,
        typeof option.series[i].data[j] == 'undefined'
          ? 0
          : option.series[i].data[j]
      )
      Min = Math.min(
        Min,
        typeof option.series[i].data[j] == 'undefined'
          ? 0
          : option.series[i].data[j]
      )
    }
  }

  // 根据最大最小值，自适应调整气泡大小
  let Multiple = Math.ceil(Math.sqrt(Max - Min))
  while (Multiple >= 10) Multiple = Math.ceil(Math.sqrt(Multiple))

  if (Math.abs(Min) <= 1) Min = 2

  for (let i = 0; i < option.series.length; i++) {
    option.series[i].symbolSize = function (data: any) {
      let symbolSize = Math.max(data, Min) - Min
      symbolSize = Math.ceil(symbolSize / Math.abs(Min))
      symbolSize = symbolSize * Multiple
      symbolSize = Math.max(10, symbolSize)
      return symbolSize
    }
  }
}

// 雷达图设置
function setRadarOption(V3ChartConfig: any, V3Data: any, option: any) {
  console.log('雷达图设置')
  if (!V3Data.recordCount) {
    return
  }

  if (typeof option.grid != 'undefined') {
    delete option.grid
  }

  if (typeof option.xAxis != 'undefined') {
    delete option.xAxis
  }

  if (typeof option.yAxis != 'undefined') {
    delete option.yAxis
  }

  option.tooltip = {}
  option.series = [
    {
      name:
        V3ChartConfig.serie.name == null
          ? V3ChartConfig.serie.value
          : V3ChartConfig.serie.name,
      type: getChartType(V3ChartConfig.chartType.toLowerCase()),
      data: []
    }
  ]

  option.radar = {}

  // 图形显示占比，数值型 0~100，默认 65
  if (V3ChartConfig.serie.radius)
    option.radar.radius = V3ChartConfig.serie.radius

  //center 中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标 ，默认 ['50%', '50%']
  if (V3ChartConfig.serie.center)
    option.radar.center = V3ChartConfig.serie.center

  //shape 图绘制类型 polygon 多边形和circle 圆环，默认 polygon
  if (V3ChartConfig.serie.shape) option.radar.shape = V3ChartConfig.serie.shape

  //startAngle 坐标系起始角度，数值型 0~360，默认 90
  if (V3ChartConfig.serie.startAngle)
    option.radar.startAngle = V3ChartConfig.serie.startAngle

  //是否填充颜色
  if (V3ChartConfig.serie.FillColor == true) {
    option.series[0].itemStyle = {}
    option.series[0].itemStyle.normal = {}
    option.series[0].itemStyle.normal.areaStyle = {}
    option.series[0].itemStyle.normal.areaStyle.type = 'default'
  }

  option.radar.indicator = []
  let indicator = []
  if (V3ChartConfig.x.value != null) {
    //动态横轴
    for (let i = 0; i < V3Data.values.length; i++) {
      if (indicator.indexOf(V3Data.values[i][V3ChartConfig.x.value]) == -1) {
        indicator.push(V3Data.values[i][V3ChartConfig.x.value])

        option.radar.indicator.push({
          FieldName: V3ChartConfig.x.value,
          name: V3Data.values[i][V3ChartConfig.x.value]
        })
      }
    }
  } else {
    for (let i = 0; i < V3ChartConfig.y.length; i++) {
      if (indicator.indexOf(V3ChartConfig.y[i].name) == -1) {
        indicator.push(V3ChartConfig.y[i].name)

        option.radar.indicator.push({
          FieldName: V3ChartConfig.y[i].code,
          name: V3ChartConfig.y[i].name
        })
      }
    }
  }

  //图例
  if (typeof option.legend == 'undefined') option.legend = {}
  option.legend.data = []

  if (V3ChartConfig.serie.value != null) {
    //动态图例
    for (var i = 0; i < V3Data.values.length; i++) {
      if (
        option.legend.data.indexOf(
          V3Data.values[i][V3ChartConfig.serie.value]
        ) == -1
      ) {
        option.legend.data.push(V3Data.values[i][V3ChartConfig.serie.value])

        option.series[0].data.push({
          FieldName: V3ChartConfig.serie.value,
          name: V3Data.values[i][V3ChartConfig.serie.value]
        })
      }
    }
  } else {
    for (let i = 0; i < V3ChartConfig.y.length; i++) {
      if (option.legend.data.indexOf(V3ChartConfig.y[i].name) == -1) {
        option.legend.data.push(V3ChartConfig.y[i].name)

        option.series[0].data.push({
          FieldName: V3ChartConfig.y[i].code,
          name: V3ChartConfig.y[i].name
        })
      }
    }
  }

  for (let i = 0; i < option.series[0].data.length; i++) {
    option.series[0].data[i].value = []
    for (let j = 0; j < option.radar.indicator.length; j++) {
      option.series[0].data[i].value.push(null)
    }
  }

  //雷达图数据
  for (let i = 0; i < V3Data.values.length; i++) {
    for (let j = 0; j < option.radar.indicator.length; j++) {
      if (V3ChartConfig.serie.value != null) {
        //动态图例
        for (let k = 0; k < option.series[0].data.length; k++) {
          if (
            V3Data.values[i][option.series[0].data[k].FieldName] ==
            option.series[0].data[k].name
          ) {
            if (V3ChartConfig.x.value != null) {
              //动态横轴
              if (
                V3Data.values[i][option.radar.indicator[j].FieldName] ==
                option.radar.indicator[j].name
              ) {
                option.series[0].data[k].value[j] =
                  V3Data.values[i][V3ChartConfig.y[0].code]
              }
            } else {
              option.series[0].data[k].value[j] =
                V3Data.values[i][option.radar.indicator[j].FieldName]
            }
          }
        }
      } else {
        if (
          V3Data.values[i][option.radar.indicator[j].FieldName] ==
          option.radar.indicator[j].name
        ) {
          for (var k = 0; k < option.series[0].data.length; k++) {
            option.series[0].data[k].value[j] =
              V3Data.values[i][option.series[0].data[k].FieldName]
          }
        }
      }
    }
  }

  // 自动调整
  let Max = Math.ceil(caclArrayMaxValue(option.series[0].data[0].value)),
    Min = Math.floor(caclArrayMinValue(option.series[0].data[0].value))

  for (let i = 0; i < option.series[0].data.length; i++) {
    if (option.series[0].data[i].value.length > 0) {
      Max = Math.max(Max, caclArrayMaxValue(option.series[0].data[i].value))
      Min = Math.min(Min, caclArrayMinValue(option.series[0].data[i].value))
    }
  }

  for (let i = 0; i < option.radar.indicator.length; i++) {
    option.radar.indicator[i].max = Math.ceil(Max * 1.1)
    option.radar.indicator[i].min = Math.floor(Min * 0.9)
  }

  if (V3Data.values.length == 0) {
    if (typeof option.series != 'undefined') {
      delete option.series
    }

    if (typeof option.radar.indicator != 'undefined') {
      delete option.radar.indicator
    }
  }
}

// 散点图
function setScatterOption(V3ChartConfig: any, V3Data: any, option: any) {
  if (typeof option.xAxis == 'undefined') option.xAxis = {}

  if ('data' in option.xAxis) {
    delete option.xAxis.data
  }

  option.xAxis.type = 'value'
  option.xAxis.scale = V3ChartConfig.xAxis.scale

  if (typeof option.tooltip == 'undefined') option.tooltip = {}

  if (typeof option.tooltip.axisPointer == 'undefined')
    option.tooltip.axisPointer = {}

  option.tooltip.axisPointer.type = 'cross'

  // 散点图数据
  if (typeof option.legend == 'undefined') option.legend = {}

  if (
    V3ChartConfig.serie.values == null ||
    typeof V3ChartConfig.serie.values == 'undefined'
  ) {
    option.legend.data = []
    option.series = []

    let FieldDesc = '',
      chartType = V3ChartConfig.chartType.toLowerCase()

    for (let i = 0; i < V3Data.values.length; i++) {
      FieldDesc = V3Data.values[i][V3ChartConfig.serie.value]
      if (option.legend.data.indexOf(FieldDesc) == -1) {
        option.legend.data.push(FieldDesc)

        option.series.push({
          name: FieldDesc,
          FieldName: V3ChartConfig.y[0].code,
          chartType: chartType,
          type: getChartType(chartType),
          yAxisIndex: V3ChartConfig.y[0].yAxisIndex,
          showlabel: V3ChartConfig.y[0].showlabel,
          position: V3ChartConfig.y[0].position,
          smooth: V3ChartConfig.y[0].smooth,
          symbol: V3ChartConfig.y[0].symbol,
          connectNulls: V3ChartConfig.y[0].connectNulls,
          data: [],
          average: []
        })
      }

      for (let j = 0; j < option.series.length; j++) {
        if (option.series[j].name == FieldDesc) {
          option.series[j].average.push(V3Data.values[i][V3ChartConfig.x.value])

          option.series[j].data.push([
            V3Data.values[i][V3ChartConfig.x.value],
            V3Data.values[i][V3ChartConfig.y[0].code]
          ])
        }
      }
    }

    setSeriesStyle(V3ChartConfig, option)
  } else {
    for (let i = 0; i < option.series.length; i++) option.series[i].data = []

    for (let i = 0; i < V3Data.values.length; i++) {
      for (let j = 0; j < option.series.length; j++) {
        option.series[j].data.push([
          V3Data.values[i][V3ChartConfig.x.value],
          V3Data.values[i][option.series[j].FieldName]
        ])
      }
    }
  }
}

// 漏斗图设置
function setFunnelOption(V3ChartConfig: any, V3Data: any, option: any) {
  let legendData = []

  setTitle(V3ChartConfig, option) // 主、副标题

  if (typeof option.grid != 'undefined') delete option.grid

  if (typeof option.xAxis != 'undefined') delete option.xAxis

  if (typeof option.yAxis != 'undefined') delete option.yAxis

  if (typeof option.tooltip != 'undefined') option.tooltip = {}

  option.tooltip = {}
  option.tooltip.formatter = '{b} : {c}'

  option.toolbox = {}
  option.toolbox.show = true
  option.toolbox.feature = {}
  option.toolbox.feature.saveAsImage = {}
  option.toolbox.feature.saveAsImage.show = false

  console.log('漏斗图断点')
  if (typeof option.series != 'undefined') {
    option.series = option.series[0]
    option.series.name = ''
    option.series.minSize = '33.3%'

    if (typeof option.series.label != 'undefined') {
      if (typeof option.series.label.normal != 'undefined') {
        option.series.label.normal.position = 'inside'
      }
    }

    if (typeof option.series.data != 'undefined') {
      let seriesData = [],
        Value = {}

      //动态图例
      if (
        typeof option.legend.FieldName != 'undefined' &&
        typeof option.series.FieldName != 'undefined'
      ) {
        seriesData = []

        for (let i = 0; i < V3Data.values.length; i++) {
          if (
            V3ChartConfig.serie.value != null &&
            V3ChartConfig.serie.values != null
          ) {
            for (let j = 0; j < V3ChartConfig.serie.values.length; j++) {
              if (
                V3Data.values[i][option.legend.FieldName] ==
                V3ChartConfig.serie.values[j].value
              ) {
                Value = {
                  value: V3Data.values[i][option.series.FieldName],
                  name: V3ChartConfig.serie.values[j].value
                }
                if (seriesData.indexOf(Value) == -1) {
                  seriesData.push(Value)
                  legendData.push(V3ChartConfig.serie.values[j].value)
                }
              }
            }
          } else {
            Value = {
              value: V3Data.values[i][option.series.FieldName],
              name: V3Data.values[i][option.legend.FieldName]
            }
            if (seriesData.indexOf(Value) == -1) {
              seriesData.push(Value)
              legendData.push(V3Data.values[i][option.legend.FieldName])
            }
          }
        }
      }

      option.series.data = seriesData
    }
  }

  if (typeof option.legend != 'undefined') {
    if (typeof option.legend.data != 'undefined') {
      option.legend.data = legendData
    }
  }
}

// 饼图pie、环状图dough
function setPieOption(V3ChartConfig: any, V3Data: any, option: any) {
  if (typeof option.grid != 'undefined') delete option.grid

  if (typeof option.xAxis != 'undefined') delete option.xAxis

  if (typeof option.yAxis != 'undefined') delete option.yAxis

  if (typeof option.tooltip == 'undefined') option.tooltip = {}

  option.tooltip.trigger = 'item'
  if (typeof V3ChartConfig.serie.tooltipField != 'undefined') {
    //提示内容来自配置的字段
    option.tooltip.formatter = function (params: any) {
      return params.data.toolTips
    }
  } else {
    option.tooltip.formatter = '{b}: {c}<br/>{d}%'
  }

  // 饼图 环状图
  option.series = {}
  option.series.name =
    V3ChartConfig.serie.name == null
      ? V3ChartConfig.serie.value
      : V3ChartConfig.serie.name
  if (option.series.name == null) option.series.name = ''

  option.series.type = getChartType(V3ChartConfig.chartType.toLowerCase()) // 图表类型
  option.series.radius = ['0%', V3ChartConfig.serie.radius]
  option.series.center = V3ChartConfig.serie.center // 位置

  // 环状图
  // 饼图的半径，数组的第一项是内半径，第二项是外半径。
  if (V3ChartConfig.chartType.toLowerCase() == 'dough')
    option.series.radius = ['40%', V3ChartConfig.serie.radius]

  //玫瑰图
  if (V3ChartConfig.chartType.toLowerCase() == 'rose')
    option.series.roseType = 'area'

  //内环半径
  if (
    V3ChartConfig.chartType.toLowerCase() != 'pie' &&
    typeof V3ChartConfig.serie.innerRadius != 'undefined'
  ) {
    V3ChartConfig.serie.innerRadius = V3ChartConfig.serie.innerRadius
    option.series.radius = [
      V3ChartConfig.serie.innerRadius,
      V3ChartConfig.serie.radius
    ]
  }

  // 选中模式.默认： false、single'，multiple
  option.series.selectedMode = 'single'

  //选中扇区的偏移距离
  option.series.selectedOffset = V3ChartConfig.serie.selectedOffset

  option.series.label = {}
  option.series.label.normal = {}
  option.series.label.normal.show = V3ChartConfig.serie.isShowLabel
  option.series.label.normal.textStyle = {}
  option.series.label.normal.textStyle = setFontStyle(V3ChartConfig.inCanvas) //标签的字体样式（为内画布设置的值）
  //option.series.label.normal.textStyle.fontSize = 9; //V3ChartConfig.subtitle.fontSize;
  //	option.series.label.normal.textStyle.fontWeight = V3ChartConfig.subtitle.bold == "0" ? 'normal' :
  //		'bold';

  if (V3ChartConfig.serie.isShowDataLabel)
    option.series.label.normal.formatter = '{b}: {c}\n{d}%'

  option.series.labelLine = {}
  option.series.labelLine.normal = {}
  option.series.labelLine.normal.length = 5
  option.series.labelLine.normal.length2 = option.series.selectedOffset + 10
  option.series.labelLine.normal.smooth = true

  if (typeof option.legend == 'undefined') option.legend = {}

  option.legend.data = []
  option.series.data = []
  for (let i = 0; i < V3Data.values.length; i++) {
    for (let j = 0; j < V3ChartConfig.y.length; j++) {
      let SeriesName = V3ChartConfig.y[j].name
      if (V3ChartConfig.y.length == 1)
        SeriesName = V3Data.values[i][V3ChartConfig.serie.value]

      option.legend.data.push(SeriesName)

      //该数据项是否被选中
      let selected = V3ChartConfig.serie.selecteName == SeriesName
      if (typeof V3ChartConfig.serie.tooltipField != 'undefined') {
        let toolTips = V3Data.values[i][V3ChartConfig.serie.tooltipField]
        option.series.data.push({
          FieldName: V3ChartConfig.y[j].code,
          name: SeriesName,
          value: V3Data.values[i][V3ChartConfig.y[j].code],
          selected: selected,
          toolTips: toolTips
        })
      } else {
        option.series.data.push({
          FieldName: V3ChartConfig.y[j].code,
          name: SeriesName,
          value: V3Data.values[i][V3ChartConfig.y[j].code],
          selected: selected
        })
      }
    }
  }
}

// 设置图表标注
function setMarkPoint(V3ChartConfig: any, option: any) {
  if (typeof option.series == 'undefined') return

  if (V3ChartConfig.x.values != null) return

  for (let i = 0; i < option.series.length; i++) {
    if (typeof option.series[i].markPoint == 'undefined')
      option.series[i].markPoint = {}

    option.series[i].markPoint.data = []
    option.series[i].markPoint.data.push({
      type: 'max',
      name: '最大值'
    })

    option.series[i].markPoint.data.push({
      type: 'min',
      name: '最小值'
    })
  }
}

// 设置图表标线
function setMarkLine(V3ChartConfig: any, option: any) {
  if (typeof option.series == 'undefined') return

  if (V3ChartConfig.x.values != null) return

  for (let i = 0; i < option.series.length; i++) {
    if (typeof option.series[i].markLine == 'undefined')
      option.series[i].markLine = {}

    option.series[i].markLine.data = []

    if (option.series.length <= 3) {
      option.series[i].markLine.data.push({
        type: 'max',
        name: '最大值'
      })

      option.series[i].markLine.data.push({
        type: 'min',
        name: '最小值'
      })
    }

    option.series[i].markLine.data.push({
      type: 'average',
      name: '平均值'
    })

    // 特殊处理散点图
    if (typeof option.series[i].average != 'undefined') {
      option.series[i].markLine.data.push({
        xAxis: option.series[i].average.maxValue(),
        name: '最大值'
      })

      option.series[i].markLine.data.push({
        xAxis: option.series[i].average.minValue(),
        name: '最小值'
      })

      option.series[i].markLine.data.push({
        xAxis: option.series[i].average.avgValue(),
        name: '平均值'
      })
    }
  }
}

function handleOptions(V3ChartConfig: any, V3Data: any) {
  // 指定图表的配置项和数据
  let chartType = V3ChartConfig.chartType.toLowerCase()

  //升级配置
  upgradeChartConfig(V3ChartConfig)

  let option: { [key: string | number | symbol]: any } = {}

  //图表配色
  if (typeof V3ChartConfig.color == 'undefined') {
    option.color = getChartColor(V3ChartConfig.palette) //预设
  } else {
    option.color = V3ChartConfig.color //自定义
  }

  if (chartType == 'angular') {
    setGaugeOption(V3ChartConfig, V3Data, option) // 仪表盘
  } else {
    setBaseOption(V3ChartConfig, V3Data, option) // 图表基本设置
    setSeriesOption(V3ChartConfig, V3Data, option) // 图表数据项
  }

  if (chartType == 'radar') {
    setRadarOption(V3ChartConfig, V3Data, option) // 雷达图
  } else if (chartType == 'bubble') {
    setBubbleOption(option) // 气泡图 必须绑定数据后再设置
  } else if (chartType == 'scatter') {
    setScatterOption(V3ChartConfig, V3Data, option) // 散点图
  } else if (chartType == 'funnel') {
    setFunnelOption(V3ChartConfig, V3Data, option) // 漏斗图
  } else if (
    chartType == 'pie' || // 饼图
    chartType == 'dough' || //环状图
    chartType == 'rose'
  ) {
    setPieOption(V3ChartConfig, V3Data, option) //玫瑰图
  } else if (chartType == 'column' || chartType == 'bar') {
    //横柱、竖柱 2D
    let datas = V3Data.values
    if (option.series && option.series.length == 1) {
      let ser = option.series[0],
        colorColumn = V3ChartConfig.y[0].colorColCode
      if (colorColumn) {
        ser.itemStyle = {
          normal: {
            color: function (data: any) {
              var item = datas[data.dataIndex]
              if (item) {
                //窗体设计器点预览会报错
                var color = item[colorColumn]
                return color
              }
            }
          }
        }
      }
    }
  }

  if (
    chartType != 'pie' &&
    chartType != 'dough' &&
    chartType != 'radar' &&
    chartType != 'angular'
  ) {
    //setMarkPoint(V3ChartConfig, option)
    //setMarkLine(V3ChartConfig, option)
  }

  return option
}

export { handleOptions }
