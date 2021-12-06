import React, { forwardRef, CSSProperties } from 'react'

import InputUnstyled, { InputUnstyledProps } from '@mui/base/InputUnstyled'

import { styled } from '@mui/system'

import { Height, Width } from '@v-act/schema-types'

interface JGTextBoxProps extends InputUnstyledProps {
  multiHeight?: Height
  multiWidth?: Width
  labelText?: string
  labelWidth?: number
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
`

const CustomInput = forwardRef(function (
  props: JGTextBoxProps,
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

const JGTextBox = function (props: JGTextBoxProps) {
  const wrapStyles: CSSProperties = {
    width: props.multiWidth,
    height: props.multiHeight,
    fontSize: '14px',
    fontFamily:
      'Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\\5FAE\\8F6F\\96C5\\9ED1,Arial,sans-serif'
  }
  const labelStyles: CSSProperties = {
    width: props.labelWidth,
    height: props.multiHeight,
    textAlign: 'right',
    display: 'inline-block',
    paddingRight: '6px'
  }
  const inputStyles = {
    width:
      props.multiWidth -
      (props.labelWidth == undefined ? 94 : props.labelWidth),
    height: props.multiHeight,
    display: 'inline-block'
  }
  return (
    <div style={wrapStyles}>
      <span style={labelStyles}>{props.labelText}:</span>
      <CustomInput style={inputStyles} placeholder="Type something..." />
    </div>
  )
}

JGTextBox.defaultProps = {
  multiHeight: 26,
  multiWidth: 235,
  labelWidth: 94,
  labelText: '文本'
}

export default JGTextBox
