import React, { CSSProperties, forwardRef } from 'react'

import { Property } from 'csstype'

import {
  Box,
  BoxProps,
  InputLabel,
  MenuItem,
  Select,
  SelectProps
} from '@mui/material'

/* 自定义下拉框 */
const CustomSelect = forwardRef(function (
  props: SelectProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return <Select {...props} ref={ref}></Select>
})

/* 包装器属性 */
export interface JGComboBoxProps extends BoxProps {
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
  console.log('Zona')
  /* 标签宽度 */
  const labelWidth =
    props.labelVisible == false
      ? '0px'
      : props.labelWidth === undefined
      ? '94px'
      : props.labelWidth

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
  height: '26px',
  width: '235px',
  multiHeight: '26px',
  multiWidth: '235px',
  labelWidth: '94px',
  labelText: '下拉选择',
  placeholder: '',
  visible: true,
  labelVisible: true,
  disabled: false
}

export default JGComboBox
export { JGComboBox }
