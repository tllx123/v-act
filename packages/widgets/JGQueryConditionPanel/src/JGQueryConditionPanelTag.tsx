import Box from '@mui/material/Box'
import { JGLabel } from '@v-act/jglabel'
import { JGLocateBox } from '@v-act/jglocatebox'
import { ContextProvider, createContext } from '@v-act/widget-context'

interface JGQueryConditionPanelTagProps {
  searchBoxEnabled?: boolean
  placeholder?: string
}

function JGQueryConditionPanelTag(props: JGQueryConditionPanelTagProps) {
  let spacerSpan = 8 - 1
  if (props.searchBoxEnabled) {
    spacerSpan -= 1
  }
  const context = createContext({ position: 'static' })
  return (
    <ContextProvider context={context}>
      <Box
        display="grid"
        gridTemplateColumns={'repeat(8, 1fr)'}
        gap={1}
        sx={{
          borderBottom: '1px solid #DCDEE2',
          alignItems: 'center'
        }}
      >
        <Box gridColumn="span 1">
          <JGLabel height="40px">条件筛选</JGLabel>
        </Box>
        <Box gridColumn={'span ' + spacerSpan}></Box>
        {props.searchBoxEnabled ? (
          <Box gridColumn="span 1">
            <JGLocateBox height="32px" hint={props.placeholder}></JGLocateBox>
          </Box>
        ) : null}
      </Box>
    </ContextProvider>
  )
}

export default JGQueryConditionPanelTag
export { JGQueryConditionPanelTag }
