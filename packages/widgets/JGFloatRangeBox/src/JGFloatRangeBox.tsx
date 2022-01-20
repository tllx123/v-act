import React, { CSSProperties, forwardRef, useState } from 'react'

import { Property } from 'csstype'

import InputUnstyled, { InputUnstyledProps } from '@mui/base/InputUnstyled'
import Box from '@mui/material/Box'
import { styled } from '@mui/system'
import { JGInputLabel } from '@v-act/jginputlabel'
import { Height, Width } from '@v-act/schema-types'
import { FieldValue, useContext } from '@v-act/widget-context'
import {
  getFieldValue,
  isNullOrUnDef,
  toHeight,
  toLabelWidth,
  toWidth
} from '@v-act/widget-utils'

interface JGFloatBoxProps extends InputUnstyledProps {
  /**
   * 左边距
   */
  left?: Property.Left
  /**
   * 上边距
   */
  top?: Property.Top
  /**
   * 高度
   */
  multiHeight?: Height
  /**
   * 宽度
   */
  multiWidth?: Width
  /**
   * 标题
   */
  labelText?: string
  /**
   * 标题宽度
   */
  labelWidth?: number
  /**
   * 提醒文字
   */
  placeholder?: string
  /**
   * 必填
   */
  isMust?: boolean
  /**
   * 显示
   */
  visible?: boolean

  /**
   * 显示标题
   */
  labelVisible?: boolean

  /**
   * 显示宽度
   */
  width?: Property.Width

  /**
   * 显示高度
   */
  height?: Property.Height

  /**
   * 输入框显示类型
   */
  inputType?: string
  /**
   * 禁用
   */
  disabled?: boolean
  /**
   * 实体编号
   */
  tableName?: string | null
  /**
   * 字段编号
   */
  columnName?: string | null
}

const StyledInputElement = styled('input')`
  color: #333;
  width: 100%;
  outline: none;
  height: 100%;
  border: 0;
  text-align: center;
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
`

const CustomInput = forwardRef(function (
  props: JGFloatBoxProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <InputUnstyled
      components={{ Input: StyledInputElement }}
      {...props}
      ref={ref}
    />
  )
})

const JGFloatRangeBox = function (props: JGFloatBoxProps) {
  if (!props.visible) {
    return null
  }
  const context = useContext()
  let value: FieldValue = ''
  if (props.tableName && props.columnName) {
    value = getFieldValue(props.tableName, props.columnName, context)
    value = isNullOrUnDef(value) ? '' : value
  }
  const [inputStartVal, setInputStart] = useState(value)
  const [inputEndVal, setInputEndVal] = useState(value)
  const [focusVal, setFocusVal] = useState(false)
  const width = toWidth(props.multiWidth, context, '235px')
  const height = toHeight(props.multiHeight, context, '26px')
  const labelWidth = props.labelVisible
    ? toLabelWidth(props.labelWidth, context, 94)
    : 0
  const wrapStyles: CSSProperties = {
    width: width,
    height: height,
    fontSize: '14px',
    position: context.position,
    display: 'flex',
    alignItems: 'center',
    left: props.left,
    top: props.top,
    fontFamily:
      'Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\\5FAE\\8F6F\\96C5\\9ED1,Arial,sans-serif'
  }
  const inputStyles = {
    width: '100%',
    height: height
  }
  const filterForInteger = (val: string) => {
    let filterVal = val.replace(/[^(-?\d)]/gi, '')
    if (filterVal.lastIndexOf('-') !== -1 && filterVal.lastIndexOf('-') !== 0) {
      filterVal = '-' + filterVal.replace(/[^\d]/gi, '')
    }
    return filterVal
  }
  const handleChangeStart = (e) => {
    let val = filterForInteger(e.target.value)
    setInputStart(val)
  }
  const handleChangeEnd = (e) => {
    let val = filterForInteger(e.target.value)
    setInputEndVal(val)
  }
  const inputWrapSx = {
    'display': 'flex',
    'alignItems': 'center',
    'border': '1px solid #dcdee2',
    'backgroundColor': '#fff',
    'fontSize': '12px',
    'borderRadius': '4px',
    'padding': '0 4px',
    '&:hover': {
      borderColor: '#356abb'
    },
    '&:focus': {
      borderColor: '#356abb',
      background: ' #fff',
      boxShadow: '0 0 0 2px rgba(53, 106, 187, 0.3)'
    },
    '[disabled]': {
      background: '#f6f7fb'
    }
  }
  const focusStyle: CSSProperties = {
    borderColor: '#356abb',
    background: ' #fff',
    boxShadow: '0 0 0 2px rgba(53, 106, 187, 0.3)'
  }
  return (
    <div style={wrapStyles} value-show={value}>
      <JGInputLabel
        width={labelWidth}
        height={height}
        visible={props.labelVisible}
        required={props.isMust}
      >
        {props.labelText}
      </JGInputLabel>
      <Box sx={inputWrapSx} style={focusVal ? focusStyle : void 0}>
        <CustomInput
          style={inputStyles}
          placeholder={props.placeholder}
          type={props.inputType === 'integer' ? 'text' : props.inputType}
          onChange={(e) => handleChangeStart(e)}
          value={inputStartVal}
          disabled={props.disabled}
          onFocus={() => setFocusVal(true)}
          onBlur={() => setFocusVal(false)}
        />
        <Box>~</Box>
        <CustomInput
          style={inputStyles}
          placeholder={'结束值'}
          type={props.inputType === 'integer' ? 'text' : props.inputType}
          onChange={(e) => handleChangeEnd(e)}
          value={inputEndVal}
          disabled={props.disabled}
          onFocus={() => setFocusVal(true)}
          onBlur={() => setFocusVal(false)}
        />
      </Box>
    </div>
  )
}

JGFloatRangeBox.defaultProps = {
  left: '0px',
  top: '0px',
  multiHeight: '26px',
  multiWidth: '235px',
  labelWidth: 94,
  labelText: '文本',
  placeholder: '开始值',
  isMust: false,
  visible: true,
  labelVisible: true,
  inputType: 'number',
  disabled: false
}

export default JGFloatRangeBox
export { JGFloatRangeBox }
export type { JGFloatBoxProps }
