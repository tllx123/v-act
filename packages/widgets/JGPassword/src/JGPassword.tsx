import React, { forwardRef, CSSProperties, useState } from 'react'

import InputUnstyled, { InputUnstyledProps } from '@mui/base/InputUnstyled'

import { styled } from '@mui/system'

import { Height, Width } from '@v-act/schema-types'

import { Property } from 'csstype'

interface JGPasswordProps extends InputUnstyledProps {
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
`

const CustomInput = forwardRef(function (
  props: JGPasswordProps,
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

const JGPassword = function (props: JGPasswordProps) {
  if (!props.visible) {
    return null
  }
  const [inputVal, setInputVal] = useState('')
  const wrapStyles: CSSProperties = {
    width: props.width || props.multiWidth,
    height: props.height || props.multiHeight,
    fontSize: '14px',
    position: 'absolute',
    left: props.left,
    top: props.top,
    fontFamily:
      'Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\\5FAE\\8F6F\\96C5\\9ED1,Arial,sans-serif'
  }
  const labelWidth = props.labelVisible
    ? props.labelWidth === undefined
      ? 94
      : props.labelWidth
    : 0
  const labelStyles: CSSProperties = {
    width: labelWidth,
    height: props.height || props.multiHeight,
    textAlign: 'right',
    display: 'inline-block',
    paddingRight: '6px'
  }
  const inputStyles = {
    width: (props.width || props.multiWidth) - labelWidth,
    height: props.height || props.multiHeight,
    display: 'inline-block'
  }
  return (
    <div style={wrapStyles}>
      {labelWidth > 0 ? (
        <span style={labelStyles}>
          {props.labelText}
          {props.isMust ? <label style={{ color: 'red' }}>*</label> : ''}
        </span>
      ) : (
        ''
      )}
      <CustomInput
        style={inputStyles}
        placeholder={props.placeholder}
        type={'password'}
        onChange={(e) => setInputVal(e.target.value)}
        value={inputVal}
      />
    </div>
  )
}

JGPassword.defaultProps = {
  left: 0,
  top: 0,
  multiHeight: 26,
  multiWidth: 235,
  labelWidth: 94,
  labelText: '文本',
  placeholder: '',
  isMust: false,
  visible: true,
  labelVisible: true,
  inputType: 'number'
}

export default JGPassword
export { JGPassword, JGPasswordProps }