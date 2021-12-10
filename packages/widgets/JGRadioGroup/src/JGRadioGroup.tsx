import { forwardRef, CSSProperties } from 'react'

import { Property } from 'csstype'

import { Radio, Box, InputLabel, BoxProps } from '@mui/material'
import React from 'react'

/* 包装器属性 */
interface JGRadioGroupProps extends BoxProps {
  /**
   * 编码
   */
  code?: string

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
  labelText?: String

  /**
   * 标签宽度
   */
  labelWidth?: number

  /**
   * 是否显示标签
   */
  labelVisible?: boolean
}

const JGRadioGroup = function (props: JGRadioGroupProps) {
  /* 如果单选框组不可见，直接返回null */
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
    height: props.height,
    lineHeight: props.height,
    textAlign: 'right',
    display: 'inline-block',
    paddingRight: '6px'
  }

  /* 单选框组样式 */
  const radioBoxStyles: CSSProperties = {
    height: props.height,
    margin: 0,
    padding: '0px 4px',
    border: '1px solid #0000003b',
    borderRadius: '4px',
    flex: 1
  }

  /* 单选框样式 */
  const radioStyles: CSSProperties = {
    height: props.height,
    margin: 0,
    padding: '0px 4px'
  }

  /* 编码(唯一) */
  const code = props.code
    ? props.code
    : `${Date.now()}${Math.random().toString(32).slice(2)}`

  const [selectedValue, setSelectedValue] = React.useState('a')

  const handleChange = (event: any) => {
    setSelectedValue(event.target.value)
  }

  return (
    <Box style={wrapStyles}>
      {labelWidth !== '0px' ? (
        <InputLabel id={code} style={labelStyles}>
          {props.labelText}
        </InputLabel>
      ) : (
        ''
      )}
      <Box style={radioBoxStyles}>
        <div style={{ display: 'inline-block' }}>
          <Radio
            checked={selectedValue === 'a'}
            onChange={handleChange}
            value="a"
            name="radio-buttons"
            inputProps={{ 'aria-label': 'A' }}
            style={radioStyles}
            size="small"
          />
          <span style={{ paddingRight: '5px' }}>a</span>
        </div>
        <div style={{ display: 'inline-block' }}>
          <Radio
            checked={selectedValue === 'b'}
            onChange={handleChange}
            value="b"
            name="radio-buttons"
            inputProps={{ 'aria-label': 'B' }}
            style={radioStyles}
            size="small"
          />
          <span>b</span>
        </div>
      </Box>
    </Box>
  )
}

JGRadioGroup.defaultProps = {
  left: 0,
  top: 0,
  height: '26px',
  width: 500,
  labelWidth: 94,
  labelText: '单选组',
  placeholder: '',
  visible: true,
  labelVisible: true,
  disabled: false
}

export default JGRadioGroup
export { JGRadioGroup, JGRadioGroupProps }
