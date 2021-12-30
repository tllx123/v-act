import Box from '@mui/material/Box'
import { Property } from 'csstype'
import { ButtonGroup, Button } from '@mui/material'
import { useContext } from '@v-act/widget-context'
import { toHeight, toWidth } from '@v-act/widget-utils'

interface JGButtonGroupProps {
  left?: Property.Left
  top?: Property.Top
  position?: Property.Position
  height?: Property.Height
  width?: Property.Width
}

const JGButtonGroup = (props: JGButtonGroupProps) => {
  const { left, top, height, width, position, ...resprops } = props
  const context = useContext()

  return (
    <Box
      variant="contained"
      sx={{
        width: toWidth(width, context, '235px'),
        height: '30px',
        position: context.position,
        left: left,
        top: top
      }}
      component={ButtonGroup}
    >
      <Button sx={{ height: '100%', width: '100%' }}>按钮1</Button>
      <Button sx={{ height: '100%', width: '100%' }}>按钮2</Button>
      <Button sx={{ height: '100%', width: '100%' }}>按钮3</Button>
    </Box>
  )
}

JGButtonGroup.defaultProps = {
  left: '20px',
  top: '50px',
  width: '250px',
  height: '30px',
  position: 'absolute'
}

export default JGButtonGroup
export { JGButtonGroup, type JGButtonGroupProps }
