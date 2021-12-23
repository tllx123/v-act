import React from 'react'

import Box from '@mui/material/Box'
import { JGButton } from '@v-act/jgbutton'
import { Control, ReactEnum } from '@v-act/schema-types'
import { ContextProvider, createContext } from '@v-act/widget-context'
import {
  getChildrenTitleWidth,
  getChildrenWithoutFragment,
  toBoolean,
  toNumber
} from '@v-act/widget-utils'

import { JGQueryConditionPanelTag } from './JGQueryConditionPanelTag'

interface JGQueryConditionPanelFormProps {
  /**
   * 快速检索
   */
  searchBoxEnabled?: boolean
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
}

const JGQueryConditionPanelForm = function (
  props: JGQueryConditionPanelFormProps
) {
  const columnCount = props.columnCount || 3
  let children = getChildrenWithoutFragment(props.children)
  let remainNumCols = columnCount
  if (children && children.length > 0) {
    let labelWidth = 0
    const itemLabelWidth = props.itemLabelWidth || ReactEnum.Content
    if (itemLabelWidth === ReactEnum.Content) {
      labelWidth = getChildrenTitleWidth(children)
    } else {
      labelWidth = parseInt(itemLabelWidth)
    }
    const context = createContext({
      position: 'static',
      multiWidth: ReactEnum.Space,
      labelWidth: labelWidth
    })
    children = children.map((child, i) => {
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
    if (remainNumCols > 1) {
      children.push(<Box gridColumn={'span ' + (remainNumCols - 1)}></Box>)
    }
    const ctx1 = createContext({
      position: 'static'
    })
    children.push(
      <Box>
        <ContextProvider context={ctx1}>
          <JGButton width="76px" height="32px" sx={{ float: 'right' }}>
            {props.queryButtonText}
          </JGButton>
        </ContextProvider>
      </Box>
    )
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
        searchBoxEnabled={props.searchBoxEnabled}
        placeholder={props.quickSearchHint}
      ></JGQueryConditionPanelTag>
      <Box
        display="grid"
        gridTemplateColumns={'repeat(' + columnCount + ', 1fr)'}
        gap={2}
        sx={{
          marginTop: '4px'
        }}
      >
        {children
          ? children.map((child, i) => {
              return <React.Fragment key={i}>{child}</React.Fragment>
            })
          : null}
      </Box>
    </div>
  )
}

JGQueryConditionPanelForm.defaultProps = {
  searchBoxEnabled: true,
  queryButtonText: '查询',
  itemLabelWidth: ReactEnum.Content,
  columnCount: 3,
  quickSearchHint: ''
}

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element[] | null
) {
  const pros = control.properties
  const formProps = {
    searchBoxEnabled: toBoolean(pros.searchBoxEnabled, true),
    queryButtonText: pros.queryButtonText || '查询',
    columnCount: toNumber(pros.columnCount, 3),
    itemLabelWidth:
      pros.itemLabelWidth == ReactEnum.Content
        ? ReactEnum.Content
        : toNumber(pros.itemLabelWidth, 94) + 'px',
    quickSearchHint: ''
  }
  const controls = control.controls
  const formControls: Control[] = []
  if (controls && controls.length > 0) {
    controls.forEach((con) => {
      if (
        con.type === 'JGLocateBox' &&
        con.properties.code == 'JGLocateBox_quickSearch1'
      ) {
        formProps.quickSearchHint = con.properties.hint || ''
      } else {
        formControls.push(con)
      }
    })
  }
  return (
    <JGQueryConditionPanelForm {...formProps}>
      {render(formControls)}
    </JGQueryConditionPanelForm>
  )
}

export default JGQueryConditionPanelForm
export {
  convert,
  JGQueryConditionPanelForm,
  type JGQueryConditionPanelFormProps
}
