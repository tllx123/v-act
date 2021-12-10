import { forwardRef, CSSProperties } from 'react'

import { Property } from 'csstype'

import {
  Box,
  BoxProps,
  LinearProgress,
  LinearProgressProps,
  Typography,
  createTheme,
  ThemeProvider
} from '@mui/material'
import { VActThemeOptions } from 'packages/utils/v-act-styles/src'

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
  top?: number

  /**
   * 下边距
   */
  bottom?: Property.Bottom

  /**
   * 左边距
   */
  left?: number

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

  /********************** 数据 ***********************************/

  /**
   * 值
   */
  value?: number
}

const JGPercent = function (props: JGPercentProps) {
  /* 如果百分比不可见，返回null */
  if (!props.visible) {
    return null
  }

  /* 包装器样式 */
  const wrapStyles: CSSProperties = {
    width: props.multiWidth ? props.multiWidth : props.width,
    height: props.multiHeight ? props.multiHeight : props.height,
    fontSize: '14px',
    position: 'absolute',
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
    color: props.fontColor,
    fontStyle: props.valueFontStyle
  }

  return (
    <Box style={wrapStyles}>
      <CustomLinearProgress value={props.value}></CustomLinearProgress>
      <Typography
        style={progressTextStyles}
        variant="caption"
        component="div"
        color="text.secondary"
      >{`${props.value}%`}</Typography>
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
export { JGPercent, JGPercentProps }
