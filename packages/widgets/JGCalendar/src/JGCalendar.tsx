import 'antd/dist/antd.css'
import 'moment/locale/zh-cn'
import 'moment/dist/locale/zh-cn'
import './calendar.css'

import React, { CSSProperties } from 'react'

import { Calendar } from 'antd'
import locale from 'antd/lib/calendar/locale/zh_CN'
import { Property } from 'csstype'
import moment from 'moment'

import { BoxProps } from '@mui/material'
import { Height, Width } from '@v-act/schema-types'
import { EntityRecord, useContext } from '@v-act/widget-context'
import { getEntityDatas, toHeight, toWidth } from '@v-act/widget-utils'

moment.locale('zh-cn')

interface JGCalendarProps extends BoxProps {
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

  /** 数据 */
  /**
   * 实体
   */
  tableName?: string | null
  /**
   * 字段
   */
  columnName?: string | null

  /**
   * 点击事件
   */
  click?: Function
}

const JGCalendar = function (props: JGCalendarProps) {
  const context = useContext()
  const width = toWidth(props.multiWidth, context, '834px')
  const height = toHeight(props.multiHeight, context, '500px')

  //构成日程数据
  let noticedata: EntityRecord[] = []
  if (props.tableName) {
    noticedata = getEntityDatas(props.tableName, context) || []
  }

  const getListData = function (value) {
    const listData: Array<string | number | boolean> = []
    let newValue = value.format('YYYY-MM-DD')
    noticedata.map(function (item) {
      if (item.StartDateField && item.EndDateField && item.NameField) {
        if (newValue >= item.StartDateField && newValue <= item.EndDateField) {
          listData.push(item.NameField)
        }
      }
    })
    return listData
  }

  const dateCellRender = function (value) {
    const listData = getListData(value)
    return (
      <div>
        {listData.map((item) => (
          <div
            style={{
              background: item ? '#FFE492' : 'none',
              border: item ? '1px solid #FBD974' : 'none',
              paddingLeft: '4px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {item}
          </div>
        ))}
      </div>
    )
  }

  // console.log(noticedata)

  const wrapStyles: CSSProperties = {
    border: '1px solid #E8EAEC',
    width: width,
    height: height,
    position: context.position,
    left: props.left,
    top: props.top,
    fontFamily:
      'Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\\5FAE\\8F6F\\96C5\\9ED1,Arial,sans-serif'
  }

  const dateClick = function () {
    props.click && props.click()
  }
  return (
    <div style={wrapStyles}>
      <Calendar
        dateCellRender={dateCellRender}
        locale={locale}
        onSelect={dateClick}
      />
    </div>
  )
}

JGCalendar.defaultProps = {
  left: '0px',
  top: '0px',
  multiHeight: '500px',
  multiWidth: '834px'
}

export default JGCalendar
export { JGCalendar, type JGCalendarProps }
