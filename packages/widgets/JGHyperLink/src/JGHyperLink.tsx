import './style.css'

import React, { CSSProperties } from 'react'

import { InputUnstyledProps } from '@mui/base/InputUnstyled'
import { styled } from '@mui/system'
import { JGInputLabel } from '@v-act/jginputlabel'
import { Height, Width } from '@v-act/schema-types'
import { FieldValue, useContext } from '@v-act/widget-context'
import {
  getFieldValue,
  isNullOrUnDef,
  toHeight,
  toWidth
} from '@v-act/widget-utils'

interface JGHyperLinkProps extends InputUnstyledProps {
  /** 其他*/
  /**
   * 标题
   */
  labelText?: string

  /** 格式 */
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
   * 显示标题
   */
  labelVisible?: boolean
  /**
   * 标题宽度
   */
  labelWidth?: number

  /** 数据 */
  /**
   * 使能
   */
  enabled?: boolean
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

const JGHyperLink = function (props: JGHyperLinkProps) {
  const context = useContext()
  let value: FieldValue = ''

  if (props.tableName && props.columnName) {
    value = getFieldValue(props.tableName, props.columnName, context)
    value = isNullOrUnDef(value) ? '' : value
  }

  const width = toWidth(props.multiWidth, context, '235px')
  const height = toHeight(props.multiHeight, context, '26px')

  const wrapStyles: CSSProperties = {
    width: width,
    height: height,
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

  const spanStyle: CSSProperties = {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    color: '#0960c3'
  }
  const divStyles: CSSProperties = {
    height: '100%',
    width: '100%',
    border: '1px solid #DCDEE2',
    borderRadius: '4px',
    padding: '3px',
    cursor: 'pointer'
  }
  return (
    <div style={wrapStyles}>
      <JGInputLabel
        width={labelWidth}
        height={props.multiHeight}
        visible={props.labelVisible}
      >
        {props.labelText}
      </JGInputLabel>
      <div style={divStyles}>
        <span style={spanStyle}>{value}</span>
      </div>
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
  labelVisible: true,
  enabled: false
}

export default JGHyperLink
export { JGHyperLink, type JGHyperLinkProps }
