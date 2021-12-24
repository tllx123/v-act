import Box from '@mui/material/Box'
import { Property } from 'csstype'
import { useContext } from '@v-act/widget-context'
import { toHeight, toLabelWidth, toWidth } from '@v-act/widget-utils'
interface JGDivProps {
  left?: Property.Left
  top?: Property.Top
  position?: Property.Position
  height?: Property.Height
  width?: Property.Width
  backColor?: string
}

const JGDiv = (props: JGDivProps) => {
  const { left, position, top, width, height, backColor } = props
  const context = useContext()
  return (
    <Box
      sx={{
        left: left,
        top: top,
        width: toWidth(width, context, '235px'),
        height: toHeight(height, context, '26px'),
        position: context.position,
        backgroundColor: backColor
      }}
      component="div"
    />
  )
}

JGDiv.defaultProps = {
  left: '20px',
  top: '50px',
  position: 'absolute',
  width: '200px',
  height: '200px'
}

export default JGDiv
export { JGDiv, JGDivProps }
