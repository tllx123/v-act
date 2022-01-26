import { CSSProperties, forwardRef, MouseEventHandler, useRef } from 'react'

import { Property } from 'csstype'

import { createTheme, ThemeProvider } from '@material-ui/core/styles'
import Box, { BoxProps } from '@mui/material/Box'
import LinearProgress, {
  LinearProgressProps
} from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import { FieldValue, useContext } from '@v-act/widget-context'
import {
  getFieldValue,
  isNullOrUnDef,
  toHeight,
  toWidth
} from '@v-act/widget-utils'

/* 进度条属性 */
interface CustomLinearProgressProps extends LinearProgressProps {
  /**
   * 比例颜色
   */
  frontcolor?: string

  /**
   * 背景颜色
   */
  backgroundColor?: string
}

/* 自定义线性进度条 */
const CustomLinearProgress = forwardRef(function (
  props: CustomLinearProgressProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  /* 进度条样式 */
  const progressStyles: CSSProperties = {
    width: '100%',
    height: '100%',
    borderRadius: '4px'
  }

  const { backgroundColor = '#e9ecef', frontcolor = '#ef5350' } = props

  /* 进度条主题 */
  const theme = createTheme({
    components: {
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            backgroundColor: backgroundColor
          },
          bar1Determinate: {
            backgroundColor: frontcolor
          }
        }
      }
    }
  })

  return (
    <ThemeProvider theme={theme}>
      <LinearProgress
        style={progressStyles}
        variant="determinate"
        {...props}
        ref={ref}
      />
    </ThemeProvider>
  )
})

/* 包装器属性 */
interface JGPercentProps extends BoxProps {
  /********************** 其它 ***********************************/

  /**
   * 控件编码
   */
  code?: string

  /**
   * 控件名称
   */
  alias?: string

  /********************** 格式 ***********************************/

  /**
   * 上边距
   */
  top?: Property.Top

  /**
   * 左边距
   */
  left?: Property.Left

  /**
   * 右边距
   */
  right?: Property.Right

  /**
   * 宽度
   */
  width?: Property.Width

  /**
   * 高度
   */
  height?: Property.Height

  /**
   * 宽度(优先)
   */
  multiWidth?: Property.Width

  /**
   * 高度(优先)
   */
  multiHeight?: Property.Height

  /**
   * 是否显示
   */
  visible?: boolean

  /**
   * 标签宽度
   */
  tabIndex?: number

  /**
   * 锚定
   */
  anchor?: string

  /**
   * 泊靠
   */
  dock?: string

  /**
   * 字体
   */
  valueFontStyle?: string

  /**
   * 字体颜色
   */
  fontColor?: string

  /**
   * 比例颜色
   */
  frontColor?: string

  /********************** 事件 ***********************************/
  /**
   * 单击事件
   */
  onClick?: MouseEventHandler

  /********************** 数据 ***********************************/

  /**
   * 实体
   */
  tableName?: string | null

  /**
   * 字段名称
   */
  columnName?: string | null

  /**
   * 值
   */
  value?: number

  /********************** 表单布局 ***********************************/
  /**
   * 跨列
   */
  colSpan?: number

  /**
   * 起始行
   */
  startRow?: number

  /**
   * 结束行
   */
  endRow?: number
}

const JGPercent = function (props: JGPercentProps) {
  /* 如果百分比不可见，返回null */
  if (!props.visible) {
    return null
  }

  console.log('JGPercent')

  const context = useContext()

  /* 处理值，用于绑定到value属性上 */
  let value: FieldValue = ''
  if (props.tableName && props.columnName) {
    value = getFieldValue(props.tableName, props.columnName, context)
    value = isNullOrUnDef(value) ? 0 : (value as number) * 100
  }

  const width = toWidth(props.multiWidth, context, '235px')
  const height = toHeight(props.multiHeight, context, '26px')

  /* 包装器样式 */
  const wrapStyles: CSSProperties = {
    width: width,
    height: height,
    fontSize: '14px',
    position: context.position,
    left: props.left,
    top: props.top,
    display: 'inline-flex',
    fontFamily:
      'Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\\5FAE\\8F6F\\96C5\\9ED1,Arial,sans-serif'
  }

  /* 进度条文本样式 */
  const progressTextStyles: CSSProperties = {
    top: '1px',
    left: 0,
    bottom: 0,
    right: 0,
    height: '100%',
    width: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: props.fontColor ? props.fontColor : '#333',
    fontStyle: props.valueFontStyle
  }

  const textInput = useRef(null)

  const handleClick = function (event: any) {
    if (props.onClick) {
      console.log(textInput.current)
      props.onClick(event)
    }
  }

  return (
    <Box style={wrapStyles} onClick={handleClick}>
      <div style={{ width: width, height: height, position: 'relative' }}>
        <CustomLinearProgress
          value={value as number}
          frontcolor={props.frontColor}
          ref={textInput}
        ></CustomLinearProgress>
        <Typography
          style={progressTextStyles}
          variant="caption"
          component="div"
          color="text.secondary"
        >{`${value}%`}</Typography>
      </div>
    </Box>
  )
}

/* 百分比默认属性 */
JGPercent.defaultProps = {
  value: 0,
  height: '22px',
  width: '200px',
  visible: true
}

export default JGPercent
export { JGPercent, type JGPercentProps }
