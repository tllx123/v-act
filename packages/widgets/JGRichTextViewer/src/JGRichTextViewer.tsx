import React, { CSSProperties } from 'react'

import { Property } from 'csstype'

import Box, { BoxProps } from '@mui/material/Box'
import Card from '@mui/material/Card'
import { Height, Width } from '@v-act/schema-types'
import { FieldValue, useContext } from '@v-act/widget-context'
import {
  getFieldValue,
  isNullOrUnDef,
  toHeight,
  toWidth
} from '@v-act/widget-utils'

interface JGRichTextViewerProps extends BoxProps {
  /** 格式*/
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
   * 实体编号
   */
  tableName?: string | null
  /**
   * 字段编号
   */
  columnName?: string | null
}

const JGRichTextViewer = function (props: JGRichTextViewerProps) {
  const context = useContext()
  const width = toWidth(props.multiWidth, context, '395px')
  const height = toHeight(props.multiHeight, context, '344px')

  //获取value
  let value: FieldValue = ''
  if (props.tableName && props.columnName) {
    value = getFieldValue(props.tableName, props.columnName, context)
    value = isNullOrUnDef(value) ? '' : value
  }

  const wrapStyles: CSSProperties = {
    width: width,
    height: height,
    position: context.position,
    left: props.left,
    top: props.top,
    fontSize: '14px',
    fontFamily:
      'Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\\5FAE\\8F6F\\96C5\\9ED1,Arial,sans-serif'
  }
  const cardStyles: CSSProperties = {
    height: '91%',
    overflowY: 'auto'
  }

  const cardContentStyles: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  }

  const headStyle: CSSProperties = {
    letterSpacing: 3
  }
  const titleStyle: CSSProperties = {
    textAlign: 'center',
    marginBottom: '20px'
  }
  const divStyle: CSSProperties = {
    // border: '1px solid',
    // padding: '16px',
    // height: '100%',
    // display: 'flex',
    // flexDirection: 'column'
  }

  const divConStyle: CSSProperties = {
    height: '78%'
  }

  const contentFootStyle: CSSProperties = {
    textAlign: 'right'
  }

  return (
    <Box style={wrapStyles}>
      <Card style={cardStyles} variant="outlined">
        {/* <CardContent style={cardContentStyles}> */}
        {/* <div>
        你是谁
      </div> */}
        <div>{value}</div>
        {/* <div style={titleStyle}>
            <Typography style={headStyle} variant="h5">
              富文本浏览控件示例标题
            </Typography>
            <Typography variant="caption">
              发布时间：2021-12-24 16:00:01 浏览次数：668
            </Typography>
          </div>
          <div style={divStyle}>
            <Typography>富文本浏览控件示例正文-开始</Typography>
            <div style={divConStyle}></div>
            <Typography style={contentFootStyle}>
              富文本浏览控件示例正文-结束
            </Typography>
          </div> */}
        {/* </CardContent> */}
      </Card>
    </Box>
  )
}

JGRichTextViewer.defaultProps = {
  left: '0px',
  top: '0px',
  multiHeight: '344px',
  multiWidth: '395px'
}

export default JGRichTextViewer
export { JGRichTextViewer, type JGRichTextViewerProps }
