import React, { CSSProperties, forwardRef } from 'react'

import InputUnstyled, { InputUnstyledProps } from '@mui/base/InputUnstyled'
import { styled } from '@mui/system'
import { JGInputLabel } from '@v-act/jginputlabel'
import { Height, Width } from '@v-act/schema-types'

interface JGHyperLinkProps extends InputUnstyledProps {
  /**
   * 左边距
   */
  left?: number
  /**
   * 上边距
   */
  top?: number
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
   * 禁用
   */
  disabled?: boolean
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

  [disabled] {
    background: #f6f7fb;
  }
`

const CustomInput = forwardRef(function (
  props: JGHyperLinkProps,
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

const JGHyperLink = function (props: JGHyperLinkProps) {
  if (!props.visible) {
    return null
  }
  const wrapStyles: CSSProperties = {
    width: props.multiWidth,
    height: props.multiHeight,
    fontSize: '14px',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
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
    textAlign: 'right',
    paddingRight: '6px'
  }
  const divStyles: CSSProperties = {
    // height: props.multiHeight
    boxSizing: 'content-box',
    borderCollapse: 'separate',
    position: 'relative',
    height: '100%',
    width: '100%',
    flex: 1,
    lineHeight: 'unset',
    border: '1px solid #DCDEE2',
    borderRadius: '4px'
  }
  return (
    <div style={wrapStyles}>
      <JGInputLabel
        width={labelWidth}
        height={props.multiHeight}
        visible={props.labelVisible}
        required={props.isMust}
      >
        {props.labelText}
      </JGInputLabel>
      <div style={divStyles}></div>
      {/* <CustomInput
        style={inputStyles}
        disabled={props.disabled}
        placeholder={props.placeholder}
      /> */}
    </div>
  )
}

JGHyperLink.defaultProps = {
  left: 0,
  top: 0,
  multiHeight: 26,
  multiWidth: 235,
  labelWidth: 94,
  labelText: '链接',
  placeholder: '',
  isMust: false,
  visible: true,
  labelVisible: true,
  disabled: false
}

export default JGHyperLink
export { JGHyperLink, type JGHyperLinkProps }
