import 'antd/dist/antd.css'
import 'moment/locale/zh-cn'
import 'moment/dist/locale/zh-cn'
import './calendar.css'

import React, { CSSProperties } from 'react'

import { Calendar, Col, Row } from 'antd'
import locale from 'antd/lib/calendar/locale/zh_CN'
import { Property } from 'csstype'
import moment from 'moment'

import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { BoxProps, Button, ButtonGroup, IconButton } from '@mui/material'
import { Height, Width } from '@v-act/schema-types'
import { useContext } from '@v-act/widget-context'
import { toHeight, toWidth } from '@v-act/widget-utils'

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
}

const JGCalendar = function (props: JGCalendarProps) {
  const context = useContext()
  const width = toWidth(props.multiWidth, context, '834px')
  const height = toHeight(props.multiHeight, context, '500px')

  const wrapStyles: CSSProperties = {
    border: '1px solid #E8EAEC',
    width: width,
    height: height,
    // fontSize: '14px',
    // display: 'flex',
    // alignItems: 'center',
    position: context.position,
    left: props.left,
    // overflow: 'visible',
    top: props.top,
    fontFamily:
      'Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\\5FAE\\8F6F\\96C5\\9ED1,Arial,sans-serif'
  }

  const inputStyle: CSSProperties = {
    height: '100%',
    padding: '0px 8px',
    border: '0'
  }
  const lineStyle: CSSProperties = {
    borderBottom: '1px solid #E8EAEC'
  }

  const calIconStyle: CSSProperties = {
    height: '100%'
  }

  const colButStyle: CSSProperties = {
    margin: 'auto'
  }

  const buttonStyle: CSSProperties = {
    border: '1px solid #E8EAEC',
    color: 'black',
    height: '28px'
  }

  return (
    <div style={wrapStyles}>
      <Calendar
        locale={locale}
        headerRender={({ value }) => {
          const month = value.month()
          const year = value.year()

          return (
            <div style={lineStyle}>
              <Row gutter={8}>
                <Col>
                  <ButtonGroup
                    variant="outlined"
                    aria-label="outlined button group"
                  >
                    <IconButton>
                      <ChevronLeftIcon
                        sx={{
                          border: '1px solid #E8EAEC',
                          width: '30px',
                          height: '30px',
                          color: '#E8EAEC'
                        }}
                      />
                    </IconButton>
                    <IconButton>
                      <ChevronRightIcon
                        sx={{
                          border: '1px solid #E8EAEC',
                          width: '30px',
                          height: '30px',
                          color: '#E8EAEC'
                        }}
                      />
                    </IconButton>
                  </ButtonGroup>
                </Col>
                <Col>
                  <input
                    style={inputStyle}
                    value={String(year) + '年' + String(month) + '月'}
                  />
                </Col>
                <Col>
                  <IconButton style={calIconStyle}>
                    <CalendarTodayIcon
                      sx={{ width: '16px', height: '16px', color: '#E8EAEC' }}
                    />
                  </IconButton>
                </Col>
                <Col span="12"></Col>
                <Col style={colButStyle}>
                  <Button style={buttonStyle}>今日</Button>
                </Col>
              </Row>
            </div>
          )
        }}
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
