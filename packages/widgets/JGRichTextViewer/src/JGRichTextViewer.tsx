import React, { CSSProperties } from 'react'

import { Property } from 'csstype'

import { Box, BoxProps, Card, CardContent, Typography } from '@mui/material'
import { Height, Width } from '@v-act/schema-types'
import { useContext } from '@v-act/widget-context'
import { toHeight, toWidth } from '@v-act/widget-utils'

interface JGRichTextViewerProps extends BoxProps {
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

const JGRichTextViewer = function (props: JGRichTextViewerProps) {
  // if (!props.visible) {
  //   return null
  // }
  const context = useContext()
  const width = toWidth(props.multiWidth, context, '235px')
  const height = toHeight(props.multiHeight, context, '26px')

  const wrapStyles: CSSProperties = {
    width: width,
    height: height,
    position: context.position,
    left: props.left,
    top: props.top
  }
  const cardStyles: CSSProperties = {
    height: '100%'
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
    border: '1px solid',
    padding: '16px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
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
        <CardContent style={cardContentStyles}>
          <div style={titleStyle}>
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
          </div>
        </CardContent>
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
