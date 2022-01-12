import React, { CSSProperties, forwardRef, useState } from 'react'

import { Property } from 'csstype'

import InputUnstyled, { InputUnstyledProps } from '@mui/base/InputUnstyled'
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

interface JGIntegerBoxProps extends InputUnstyledProps {
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
  border: 1px solid #dcdee2;
  color: #333;
  border-radius: 4px;
  padding: 0 4px;
  width: 100%;
  outline: none;
  height: 100%;
  &:hover {
    border-color: #356abb;
  }

  &:focus {
    border-color: #356abb;
    background: #fff;
    box-shadow: 0 0 0 2px rgba(53, 106, 187, 0.3);
  }
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  [disabled] {
    background: #f6f7fb;
  }
`

const CustomInput = forwardRef(function (
  props: JGIntegerBoxProps,
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

const JGIntegerBox = function (props: JGIntegerBoxProps) {
  if (!props.visible) {
    return null
  }

  const context = useContext()
  let value: FieldValue = ''
  if (props.tableName && props.columnName) {
    value = getFieldValue(props.tableName, props.columnName, context)
    value = isNullOrUnDef(value) ? '' : value
  }
  const [inputVal, setInputVal] = useState(value)
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
  const handleChange = (e) => {
    let hasMinus = e.target.value.indexOf('-') === 0
    let filterVal = e.target.value.replace(/[^0-9]/gi, '')
    if (hasMinus) filterVal = '-' + filterVal
    setInputVal(filterVal)
  }
  return (
    <div style={wrapStyles}>
      <JGInputLabel
        width={labelWidth}
        height={height}
        required={props.isMust}
        visible={props.labelVisible}
      >
        {props.labelText}
      </JGInputLabel>
      <CustomInput
        style={inputStyles}
        placeholder={props.placeholder}
        type={'text'}
        onChange={(e) => handleChange(e)}
        value={inputVal}
        disabled={props.disabled}
      />
    </div>
  )
}

JGIntegerBox.defaultProps = {
  left: '0px',
  top: '0px',
  multiHeight: '26px',
  multiWidth: '235px',
  labelWidth: 94,
  labelText: '文本',
  placeholder: '',
  isMust: false,
  visible: true,
  labelVisible: true,
  inputType: 'number',
  disabled: false
}

export default JGIntegerBox
export { JGIntegerBox }
export type { JGIntegerBoxProps }
