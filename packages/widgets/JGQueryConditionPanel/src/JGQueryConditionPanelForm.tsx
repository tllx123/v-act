import React from 'react'

import Box from '@mui/material/Box'
import { JGButton } from '@v-act/jgbutton'
import { ReactEnum } from '@v-act/schema-types'
import {
  ContextProvider,
  createContext,
  WidgetContextProps,
  withContext
} from '@v-act/widget-context'
import { getChildrenTitleWidth } from '@v-act/widget-utils'

import { JGQueryConditionPanelTag } from './JGQueryConditionPanelTag'

interface JGQueryConditionPanelFormProps {
  /**
   * 查询按钮标题
   */
  queryButtonText?: string
  /**
   * 标题宽度
   */
  itemLabelWidth?: string | ReactEnum.Content
  /**
   * 列数
   */
  columnCount?: number

  /**
   * 快速检索提示
   */
  quickSearchHint?: string

  children?: Array<JSX.Element> | null

  context?: WidgetContextProps
}

const JGQueryConditionPanelForm = withContext(function (
  props: JGQueryConditionPanelFormProps
) {
  const columnCount = props.columnCount || 3
  let children = null
  let remainNumCols = columnCount
  if (props.children && props.children.length > 0) {
    let labelWidth = 0
    const itemLabelWidth = props.itemLabelWidth || ReactEnum.Content
    if (itemLabelWidth === ReactEnum.Content) {
      labelWidth = getChildrenTitleWidth(props.children)
    } else {
      labelWidth = parseInt(itemLabelWidth)
    }
    const context = createContext({
      position: 'static',
      multiWidth: ReactEnum.Space,
      labelWidth: labelWidth
    })
    children = props.children.map((child, i) => {
      const childProps = child.props
      let colSpan = parseInt(childProps.colSpan)
      colSpan = isNaN(colSpan) ? 1 : colSpan
      remainNumCols = remainNumCols - colSpan
      remainNumCols = remainNumCols == 0 ? columnCount : remainNumCols
      const endRow = child.props.endRow == 'True'
      return (
        <React.Fragment key={i}>
          <ContextProvider context={context}>
            <Box gridColumn={'span ' + colSpan}>{child}</Box>
            {endRow && remainNumCols > 0 && remainNumCols != columnCount ? (
              <Box gridColumn={'span ' + remainNumCols}></Box>
            ) : null}
          </ContextProvider>
        </React.Fragment>
      )
    })
    if (remainNumCols === columnCount) {
      children.push(<Box gridColumn={'span ' + (columnCount - 1)}></Box>)
      children.push(
        <Box>
          <JGButton width="76px" height="32px" sx={{ float: 'right' }}>
            {props.queryButtonText}
          </JGButton>
        </Box>
      )
    } else {
      children.push(<Box gridColumn={'span ' + (remainNumCols - 1)}></Box>)
      children.push(
        <Box>
          <JGButton width="76px" height="32px" sx={{ float: 'right' }}>
            {props.queryButtonText}
          </JGButton>
        </Box>
      )
    }
  }
  return (
    <div
      style={{
        padding: '4px 16px',
        backgroundColor: '#F6F7FB',
        border: '1px solid #DCDEE2'
      }}
    >
      <JGQueryConditionPanelTag
        placeholder={props.quickSearchHint}
      ></JGQueryConditionPanelTag>
      <Box
        display="grid"
        gridTemplateColumns={'repeat(' + columnCount + ', 1fr)'}
        gap={2}
      >
        {children}
      </Box>
    </div>
  )
})

export default JGQueryConditionPanelForm
export { JGQueryConditionPanelForm, type JGQueryConditionPanelFormProps }
