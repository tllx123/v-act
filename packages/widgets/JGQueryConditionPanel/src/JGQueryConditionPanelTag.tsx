import Box from '@mui/material/Box'
import { JGLabel } from '@v-act/jglabel'
import { JGLocateBox } from '@v-act/jglocatebox'

interface JGQueryConditionPanelTagProps {
  placeholder?: string
}

function JGQueryConditionPanelTag(props: JGQueryConditionPanelTagProps) {
  return (
    <Box
      display="grid"
      gridTemplateColumns={'repeat(8, 1fr)'}
      gap={1}
      sx={{
        borderBottom: '1px solid #DCDEE2'
      }}
    >
      <Box gridColumn="span 1">
        <JGLabel height="40px">条件筛选</JGLabel>
      </Box>
      <Box gridColumn="span 6"></Box>
      <Box gridColumn="span 1">
        <JGLocateBox height="32px" hint={props.placeholder}></JGLocateBox>
      </Box>
    </Box>
  )
}

export default JGQueryConditionPanelTag
export { JGQueryConditionPanelTag }
