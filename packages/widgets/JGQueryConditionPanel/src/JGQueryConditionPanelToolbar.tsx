import React from 'react'

import Box from '@mui/material/Box'
import { ContextProvider, createContext } from '@v-act/widget-context'

interface JGQueryConditionPanelFormProps {
  /**
   * 快速检索
   */
  searchBoxEnabled: boolean

  children?: Array<JSX.Element> | null
}

function JGQueryConditionPanelToolbar(props: JGQueryConditionPanelFormProps) {
  const context = createContext({ position: 'static' })
  return (
    <Box display="grid" gridTemplateColumns={'repeat(24, 1fr)'} gap={2}>
      <ContextProvider context={context}>{props.children}</ContextProvider>
    </Box>
  )
}

export default JGQueryConditionPanelToolbar
export { JGQueryConditionPanelToolbar }
