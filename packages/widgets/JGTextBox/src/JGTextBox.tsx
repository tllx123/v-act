import React, { useState, CSSProperties, forwardRef } from 'react'
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

interface JGTextBoxProps extends InputUnstyledProps {
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
   * 禁用
   */
  disabled?: boolean
  /**
   * 占用网格宽度
   */
  colSpan?: string
  /**
   * 是否结束行
   */
  endRow?: string
  /**
   * 布局位置
   */
  position?: string
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

  [disabled] {
    background: #f6f7fb;
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
  if (!props.visible) {
    return null
  }
  const context = useContext()
  let val = ''
  if (props.tableName && props.columnName) {
    const val1 = getFieldValue(props.tableName, props.columnName, context)
    val = val1 == null || typeof val1 == 'undefined' ? '' : val
  }
  const [value, setValue] = useState<FieldValue>(val)

  const width = toWidth(props.multiWidth, context, '235px')
  const height = toHeight(props.multiHeight, context, '26px')
  const labelWidth = props.labelVisible
    ? toLabelWidth(props.labelWidth, context, 94)
    : 0
  const wrapStyles: CSSProperties = {
    width: width,
    height: height,
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    position: context.position,
    left: props.left,
    overflow: 'visible',
    top: props.top,
    fontFamily:
      'Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\\5FAE\\8F6F\\96C5\\9ED1,Arial,sans-serif'
  }
  const inputStyles = {
    width: '100%',
    height: height
  }

  // 输入框值改变
  const CustomInputEvent = (event) => setValue(event.target.value)

  return (
    <div style={wrapStyles}>
      <JGInputLabel
        width={labelWidth}
        height={height}
        visible={props.labelVisible}
        required={props.isMust}
      >
        {props.labelText}
      </JGInputLabel>

      <CustomInput
        style={inputStyles}
        disabled={props.disabled}
        placeholder={props.placeholder}
        value={value}
        onInput={CustomInputEvent}
      />
    </div>
  )
}

JGTextBox.defaultProps = {
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
  disabled: false
}

export default JGTextBox

export { JGTextBox, type JGTextBoxProps }
