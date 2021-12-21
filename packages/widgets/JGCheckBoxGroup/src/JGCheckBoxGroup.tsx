import { CSSProperties } from 'react'

import { Property } from 'csstype'

import { Box, BoxProps, Checkbox, InputLabel } from '@mui/material'

/* 包装器属性 */
export interface JGCheckBoxGroupProps extends BoxProps {
  /**
   * 编码
   */
  code?: string

  /**
   * 上边距
   */
  top?: Property.Top

  /**
   * 下边距
   */
  bottom?: Property.Bottom

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
   * 标签名称
   */
  labelText?: String

  /**
   * 标签宽度
   */
  labelWidth?: number

  /**
   * 是否显示标签
   */
  labelVisible?: boolean

  /**
   * 排列方向
   */
  flowDirection?: string

  /**
   * 边框
   */
  borderStyles?: string
}

const JGCheckBoxGroup = function (props: JGCheckBoxGroupProps) {
  /* 如果复选框组不可见，直接返回null */
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

  /* 标签宽度 */
  const labelWidth = props.labelVisible
    ? props.labelWidth === undefined
      ? '94px'
      : props.labelWidth
    : '0px'

  /* 标签样式 */
  const labelStyles: CSSProperties = {
    width: labelWidth,
    height: props.multiHeight ? props.multiHeight : props.height,
    lineHeight: props.multiHeight ? props.multiHeight : props.height,
    textAlign: 'right',
    paddingRight: '6px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: '14px',
    color: '#333'
  }

  /* 单选框组样式 */
  const checkboxStyles: CSSProperties = {
    height: props.height,
    margin: 0,
    padding: '0px 4px',
    border: '1px solid #0000003b',
    borderRadius: '4px',
    flex: 1
  }

  /* 复选框样式 */
  const checkboxItemStyles: CSSProperties = {
    height: props.height,
    margin: 0,
    padding: '0px 4px',
    fontSize: '12px'
  }

  /* 编码(唯一) */
  const code = props.code
    ? props.code
    : `${Date.now()}${Math.random().toString(32).slice(2)}`

  return (
    <Box style={wrapStyles}>
      {labelWidth !== '0px' ? (
        <InputLabel id={code} style={labelStyles}>
          {props.labelText}
        </InputLabel>
      ) : (
        ''
      )}
      <Box style={checkboxStyles}>
        <span
          style={{
            paddingRight: '8px',
            height: '26px',
            display: 'inline-flex'
          }}
        >
          <Checkbox
            defaultChecked
            size="small"
            sx={{
              width: '24px',
              height: '24px'
            }}
          />
          <span
            style={{
              lineHeight: '25px'
            }}
          >
            多选
          </span>
        </span>
        <span
          style={{
            paddingRight: '8px',
            height: '26px',
            display: 'inline-flex'
          }}
        >
          <Checkbox
            size="small"
            sx={{
              width: '24px',
              height: '24px'
            }}
          />
          <span
            style={{
              lineHeight: '25px'
            }}
          >
            多选1
          </span>
        </span>
      </Box>
    </Box>
  )
}

JGCheckBoxGroup.defaultProps = {
  left: 0,
  top: 0,
  height: '26px',
  width: '235px',
  labelWidth: '94px',
  labelText: '多选组',
  placeholder: '',
  visible: true,
  labelVisible: true,
  disabled: false
}

export default JGCheckBoxGroup
export { JGCheckBoxGroup }
