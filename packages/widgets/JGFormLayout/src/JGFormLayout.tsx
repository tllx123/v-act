import React, { CSSProperties } from 'react'

import Box from '@mui/material/Box'
import { Height, ReactEnum, toNumber, Width } from '@v-act/schema-types'
import {
  ContextProvider,
  WidgetContextProps,
  withContext
} from '@v-act/widget-context'
import {
  getChildrenTitleWidth,
  getChildrenWithoutFragmentRecursively
} from '@v-act/widget-utils'

interface Setting {
  key?: string
  index?: number
  colSpan?: number
  endRow?: boolean
}

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

  children?: JSX.Element | JSX.Element[] | null

  context?: WidgetContextProps

  setting?: Setting[]
}

const JGFormLayoutDef = function (props: JGFormLayoutProps) {
  const numCols = props.numCols ? props.numCols : 3
  let remainNumCols = numCols
  const settings = props.setting || []
  const settingMap: { [prop: string]: Setting } = {}
  const settingIndexList: Setting[] = []
  settings.forEach((set) => {
    if (typeof set.key === 'string') {
      settingMap[set.key] = set
    }
    if (typeof set.index === 'number') {
      settingIndexList[set.index] = set
    }
  })
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
    children = getChildrenWithoutFragmentRecursively(children)
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
            const setting = settingIndexList[i]
            const childProps = child.props
            let colSpan = setting ? (setting.colSpan ? setting.colSpan : 1) : 1
            colSpan = isNaN(colSpan) ? 1 : colSpan
            remainNumCols = remainNumCols - colSpan
            remainNumCols = remainNumCols == 0 ? numCols : remainNumCols
            const endRow = setting ? setting.endRow : false
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
export { JGFormLayout, type JGFormLayoutProps, type Setting }
