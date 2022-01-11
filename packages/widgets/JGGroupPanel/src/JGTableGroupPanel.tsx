import { Fragment } from 'react'

import Box from '@mui/material/Box'
import {
  ContextProvider,
  createContext,
  useContext
} from '@v-act/widget-context'
import { getChildrenWithoutFragment } from '@v-act/widget-utils'

import { JGGroupPanelProps, Setting } from './JGGroupPanel'
import { getGroupPanelProps } from './utils'

const JGTableGroupPanel = function (props: JGGroupPanelProps) {
  const numCols = props.numCols || 3
  let remainNumCols = numCols
  const settings = props.setting || []
  const settingMap: { [prop: string]: Setting } = {}
  const settingIndexList: Setting[] = []
  const context = useContext()
  const childContext = createContext({
    position: 'static'
  })
  settings.forEach((set) => {
    if (typeof set.key === 'string') {
      settingMap[set.key] = set
    }
    if (typeof set.index === 'number') {
      settingIndexList[set.index] = set
    }
  })

  const containerProps = getGroupPanelProps(props, context)
  const parseChild = (child: JSX.Element, index: number) => {
    let key = child.key
    if (!key) {
      key = child.props.code
    }
    if (key) {
      const childSetting = settingMap[key] || settingIndexList[index]
      const colSpan = childSetting ? childSetting.colSpan || 1 : 1
      remainNumCols = remainNumCols - colSpan
      remainNumCols = remainNumCols == 0 ? numCols : remainNumCols
      const endRow = childSetting ? !!childSetting.endRow : false
      return (
        <Fragment key={index}>
          <ContextProvider context={childContext}>
            <Box gridColumn={'span ' + colSpan}>{child}</Box>
            {endRow && remainNumCols > 0 && remainNumCols != numCols ? (
              <Box gridColumn={'span ' + remainNumCols}></Box>
            ) : null}
          </ContextProvider>
        </Fragment>
      )
    }
  }
  let children = getChildrenWithoutFragment(props.children)
  return (
    <Box
      display="grid"
      gridTemplateColumns={'repeat(' + numCols + ', 1fr)'}
      gap={1}
      sx={containerProps}
    >
      {children.map((child, i) => {
        return parseChild(child, i)
      })}
    </Box>
  )
}

export { JGTableGroupPanel }
