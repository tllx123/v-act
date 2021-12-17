import React from 'react'

import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Box from '@mui/material/Box'
import { JGLabel } from '@v-act/jglabel'
import { Control } from '@v-act/schema-types'
import { ContextProvider, createContext } from '@v-act/widget-context'

enum Align {
  Left = 'left',
  Right = 'right'
}
interface Setting {
  key: string
  align?: Align
}
interface JGQueryConditionPanelFormProps {
  /**
   * 折叠状态
   */
  collapseStatus?: boolean

  setting?: Setting[]

  onClick?: (status: boolean) => void

  children?: Array<JSX.Element> | null
}

function JGQueryConditionPanelToolbar(props: JGQueryConditionPanelFormProps) {
  const context = createContext({ position: 'static' })
  const leftChildren: JSX.Element[] = []
  const rightChildren: JSX.Element[] = []
  if (props.children) {
    const settings = props.setting || []
    const settingMap: { [prop: string]: Setting } = {}
    settings.forEach((setting) => {
      settingMap[setting.key] = setting
    })
    props.children.forEach((child) => {
      let key = child.key
      if (key === null) {
        key = child.props.code
      }
      if (key !== null) {
        const align = settingMap[key] ? settingMap[key].align : Align.Left
        if (align === Align.Right) {
          rightChildren.push(child)
        } else {
          leftChildren.push(child)
        }
      }
    })
  }
  const [status, setStatus] = React.useState(!!props.collapseStatus)
  const onClickHandler = props.onClick ? props.onClick : null
  if (status) {
    rightChildren.push(
      <Box
        display="grid"
        gridTemplateColumns={'repeat(2, 1fr)'}
        sx={{ alignItems: 'center', cursor: 'pointer' }}
        onClick={() => {
          setStatus(false)
          onClickHandler && onClickHandler(false)
        }}
      >
        <Box gridColumn="span 1">
          <JGLabel width="60px">展开查询</JGLabel>
        </Box>
        <Box gridColumn="span 1" sx={{ marginLeft: '-8px', paddingTop: '3px' }}>
          <ExpandMoreIcon></ExpandMoreIcon>
        </Box>
      </Box>
    )
  } else {
    rightChildren.push(
      <Box
        display="grid"
        gridTemplateColumns={'repeat(2, 1fr)'}
        sx={{ alignItems: 'center', cursor: 'pointer' }}
        onClick={() => {
          setStatus(true)
          onClickHandler && onClickHandler(true)
        }}
      >
        <Box gridColumn="span 1">
          <JGLabel width="60px">收起查询</JGLabel>
        </Box>
        <Box gridColumn="span 1" sx={{ marginLeft: '-8px', paddingTop: '3px' }}>
          <ExpandLessIcon></ExpandLessIcon>
        </Box>
      </Box>
    )
  }
  const spacerSpan = 24 - leftChildren.length - rightChildren.length
  if (spacerSpan > 0) {
    leftChildren.push(<Box gridColumn={'span ' + spacerSpan}></Box>)
  }
  const children = [...leftChildren, ...rightChildren]
  return (
    <Box display="grid" gridTemplateColumns={'repeat(24, 1fr)'} gap={2}>
      <ContextProvider context={context}>
        {children.map((child, i) => {
          return <React.Fragment key={i}>{child}</React.Fragment>
        })}
      </ContextProvider>
    </Box>
  )
}

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element[] | null
) {
  const toolbarSetStr = control.properties.toolbarSetting
  const setting: Setting[] = []
  if (toolbarSetStr) {
    const toolbarSetting = JSON.parse(toolbarSetStr)
    toolbarSetting.Items &&
      toolbarSetting.Items.forEach(
        (item: { Align: string; ItemRelevance: string }) => {
          setting.push({
            key: item.ItemRelevance,
            align: item.Align == 'right' ? Align.Right : Align.Left
          })
        }
      )
  }
  const toolbarProps = {
    setting
  }
  return (
    <JGQueryConditionPanelToolbar {...toolbarProps}>
      {render(control.headerControls ? control.headerControls : [])}
    </JGQueryConditionPanelToolbar>
  )
}

export default JGQueryConditionPanelToolbar
export { Align, convert, JGQueryConditionPanelToolbar }
