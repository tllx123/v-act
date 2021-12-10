import { forwardRef, CSSProperties } from 'react'

import { Property } from 'csstype'

import {
  Box,
  BoxProps,
  Select,
  MenuItem,
  InputLabel,
  SelectProps
} from '@mui/material'
import React from 'react'

/* 自定义下拉框 */
const CustomSelect = forwardRef(function (
  props: SelectProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return <Select {...props} ref={ref}></Select>
})

/* 包装器属性 */
interface JGComboBoxProps extends BoxProps {
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

  /******************* 数据 ***********************/

  /**
   * 值
   */
  value?: string
}

const JGComboBox = function (props: JGComboBoxProps) {
  /* 如果下拉框不可见，直接返回null */
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

  /* 下拉框样式 */
  const selectStyles: CSSProperties = {
    flex: 1,
    height: props.height,
    margin: 0,
    padding: 0
  }

  /* 编码(唯一) */
  const code = props.code
    ? props.code
    : `${Date.now()}${Math.random().toString(32).slice(2)}`

  const [value, setValue] = React.useState('')

  const handleChange = (event: any) => {
    setValue(event.target.value)
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
      <CustomSelect
        style={selectStyles}
        labelId={code}
        id={`${code}select`}
        value={value}
        defaultValue={props.value}
        onChange={handleChange}
      >
        <MenuItem value="10">10</MenuItem>
        <MenuItem value="20">20</MenuItem>
      </CustomSelect>
    </Box>
  )
}

/* 下拉框默认属性 */
JGComboBox.defaultProps = {
  left: 0,
  top: 0,
  height: 26,
  width: 235,
  labelWidth: 94,
  labelText: '下拉选择',
  placeholder: '',
  visible: true,
  labelVisible: true,
  disabled: false
}

export default JGComboBox
export { JGComboBox, JGComboBoxProps }
