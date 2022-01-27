import React, { CSSProperties } from 'react'

import { Property } from 'csstype'

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
   * 布局位置
   */
  position?: string
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
  /**
   * 提醒文字
   */
  placeholder?: string

  /**
   * 点击事件
   */
  click?: Function
}

const JGHyperLink = function (props: JGHyperLinkProps) {
  const StyleSpanElement = props.enabled
    ? styled('span')`
        height: 100%;
        display: flex;
        align-items: center;

        &:hover {
          text-decoration: underline;
          color: #0960c3;
        }
      `
    : styled('span')`
    height: 100%;
    display: flex;
    align-items: center;  
    }
  `

  const context = useContext()
  let value: FieldValue = ''

  //点击事件
  const linkEvent = function () {
    if (props.enabled) {
      // console.log("11111")
      props.click && props.click()
    }
  }

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
    position: context ? context.position : 'absolute',
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

  const divStyles: CSSProperties = {
    height: '100%',
    width: '100%',
    border: '1px solid #DCDEE2',
    borderRadius: '4px',
    padding: '3px',
    cursor: props.enabled ? 'pointer' : 'not-allowed'
  }

  const spanStyles: CSSProperties = {
    color: props.enabled ? '#0960c3' : '#000000'
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
        <StyleSpanElement
          style={spanStyles}
          placeholder={props.placeholder}
          onClick={linkEvent}
        >
          {value}
        </StyleSpanElement>
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
  enabled: false,
  placeholder: ''
}

export default JGHyperLink
export { JGHyperLink, type JGHyperLinkProps }
