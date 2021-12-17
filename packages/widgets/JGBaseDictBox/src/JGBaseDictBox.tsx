import React, { CSSProperties, forwardRef } from 'react'

import InputUnstyled, { InputUnstyledProps } from '@mui/base/InputUnstyled'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { IconButton } from '@mui/material'
import { styled } from '@mui/system'
import { Height, toWidth, Width } from '@v-act/schema-types'
import { WidgetContextProps, withContext } from '@v-act/widget-context'
import { toHeight, toLabelWidth } from '@v-act/widget-utils'

interface JGBaseDictBoxProps extends InputUnstyledProps {
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

  context?: WidgetContextProps
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
  props: JGBaseDictBoxProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <InputUnstyled
      components={{ Input: StyledInputElement }}
      readOnly={true}
      {...props}
      ref={ref}
    />
  )
})

const JGBaseDictBoxDef = function (props: JGBaseDictBoxProps) {
  if (!props.visible) {
    return null
  }
  const context = props.context
  const width = toWidth(props.multiWidth, context, '235px')
  const height = toHeight(props.multiHeight, context, '26px')
  const labelWidth = props.labelVisible
    ? toLabelWidth(props.labelWidth, context, 94)
    : 0

  const wrapStyles: CSSProperties = {
    width: width,
    height: height,
    fontSize: '14px',
    position: context ? context.position : 'absolute',
    display: 'flex',
    alignItems: 'center',
    left: props.left,
    top: props.top,
    fontFamily:
      'Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\\5FAE\\8F6F\\96C5\\9ED1,Arial,sans-serif'
  }

  const labelStyles: CSSProperties = {
    width: labelWidth,
    // height: props.multiHeight,
    textAlign: 'right',
    paddingRight: '6px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
  const inputStyles = {
    width: '100%',
    height: props.multiHeight
  }
  return (
    <div style={wrapStyles}>
      {labelWidth > 0 ? (
        <span style={labelStyles}>
          {props.labelText}
          {props.isMust ? <label style={{ color: 'red' }}>*</label> : ''}:
        </span>
      ) : (
        ''
      )}
      <CustomInput style={inputStyles} placeholder={props.placeholder} />
      <IconButton>
        <OpenInNewIcon />
      </IconButton>
    </div>
  )
}

JGBaseDictBoxDef.defaultProps = {
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
  readOnly: true
}

const JGBaseDictBox = withContext(JGBaseDictBoxDef)
export default JGBaseDictBox
export { JGBaseDictBox, JGBaseDictBoxProps }
