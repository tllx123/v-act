import React, { CSSProperties } from 'react'

import Box from '@mui/material/Box'
import { Height, ReactEnum, toNumber, Width } from '@v-act/schema-types'
import {
  ContextProvider,
  WidgetContextProps,
  withContext
} from '@v-act/widget-context'
import { getChildrenTitleWidth } from '@v-act/widget-utils'

interface JGFormLayoutProps {
  /**
   * 控件编码
   */
  code?: string
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
   * 标题宽度
   */
  titleWidth?: string | ReactEnum.Content
  /**
   * 列数
   */
  numCols?: number
  /**
   * 分组标题
   */
  groupTitle?: string

  children?: JSX.Element[] | null

  context?: WidgetContextProps
}

const JGFormLayoutDef = function (props: JGFormLayoutProps) {
  const numCols = props.numCols ? props.numCols : 3
  let remainNumCols = numCols
  let context = props.context
  const wrapStyles: CSSProperties = {
    left: props.left,
    top: props.top,
    width: props.multiWidth,
    height: props.multiHeight,
    fontSize: '14px',
    position: context ? context.position : 'absolute',
    fontFamily:
      'Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\\5FAE\\8F6F\\96C5\\9ED1,Arial,sans-serif'
  }
  let children = props.children
  if (children) {
    if (!Array.isArray(children)) {
      const chid = children as JSX.Element
      if (chid.type === React.Fragment) {
        children = chid.props.children
      }
    }
    if (!Array.isArray(children) && children) {
      children = [children]
    }
  }

  let titleWidth = props.titleWidth
  if (!titleWidth || titleWidth === ReactEnum.Content) {
    titleWidth = getChildrenTitleWidth(children || []) + ''
  }
  const childContext = Object.assign({}, context, {
    position: 'static',
    multiHeight: '32px',
    multiWidth: ReactEnum.Space,
    labelWidth: toNumber(titleWidth, 94)
  })

  const contentJSX = (
    <Box
      display="grid"
      gridTemplateColumns={'repeat(' + numCols + ', 1fr)'}
      gap={1}
    >
      {children
        ? children.map((child, i) => {
            const childProps = child.props
            let colSpan = parseInt(childProps.colSpan)
            colSpan = isNaN(colSpan) ? 1 : colSpan
            remainNumCols = remainNumCols - colSpan
            remainNumCols = remainNumCols == 0 ? numCols : remainNumCols
            const endRow = child.props.endRow == 'True'
            return (
              <React.Fragment key={i}>
                <ContextProvider context={childContext}>
                  <Box gridColumn={'span ' + colSpan}>{child}</Box>
                  {endRow && remainNumCols > 0 && remainNumCols != numCols ? (
                    <Box gridColumn={'span ' + remainNumCols}></Box>
                  ) : null}
                </ContextProvider>
              </React.Fragment>
            )
          })
        : null}
    </Box>
  )
  return (
    <React.Fragment>
      {props.groupTitle ? (
        <fieldset style={wrapStyles}>
          <legend
            style={{
              fontSize: '14px',
              color: '#8C8C8C',
              fontWeight: 'bold',
              border: '1px solid #ddd'
            }}
          >
            {props.groupTitle}
          </legend>
          {contentJSX}
        </fieldset>
      ) : (
        <div style={wrapStyles}>{contentJSX}</div>
      )}
    </React.Fragment>
  )
}

JGFormLayoutDef.defaultProps = {}

const JGFormLayout = withContext(JGFormLayoutDef)
export default JGFormLayout
export { JGFormLayout, type JGFormLayoutProps }
