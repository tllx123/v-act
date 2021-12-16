import { Fragment } from 'react'

import Box from '@mui/material/Box'
import {
  ContextProvider,
  createContext,
  useContext
} from '@v-act/widget-context'

import { JGGroupPanelProps, Setting } from './JGGroupPanel'
import { getGroupPanelProps } from './utils'

const JGTableGroupPanel = function (props: JGGroupPanelProps) {
  const numCols = props.numCols || 3
  let remainNumCols = numCols
  const settings = props.setting || []
  const settingMap: { [prop: string]: Setting } = {}
  const context = useContext()
  const childContext = createContext({
    position: 'static'
  })
  settings.forEach((set) => {
    settingMap[set.key] = set
  })

  const containerProps = getGroupPanelProps(props, context)
  return (
    <Box
      display="grid"
      gridTemplateColumns={'repeat(' + numCols + ', 1fr)'}
      gap={1}
      sx={containerProps}
    >
      {props.children
        ? props.children.map((child, i) => {
            let key = child.key
            if (!key) {
              key = child.props.code
            }
            if (key) {
              const childSetting = settingMap[key]
              const colSpan = childSetting ? childSetting.colSpan || 1 : 1
              remainNumCols = remainNumCols - colSpan
              remainNumCols = remainNumCols == 0 ? numCols : remainNumCols
              const endRow = childSetting ? !!childSetting.endRow : false
              return (
                <Fragment key={i}>
                  <ContextProvider context={childContext}>
                    <Box gridColumn={'span ' + colSpan}>{child}</Box>
                    {endRow && remainNumCols > 0 && remainNumCols != numCols ? (
                      <Box gridColumn={'span ' + remainNumCols}></Box>
                    ) : null}
                  </ContextProvider>
                </Fragment>
              )
            }
          })
        : null}
    </Box>
  )
}

export { JGTableGroupPanel }
