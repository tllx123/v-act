import Box from '@mui/material/Box'
import { Property } from 'csstype'
import { useContext } from '@v-act/widget-context'
import { toHeight, toWidth } from '@v-act/widget-utils'

export interface JGComponentContainerProps {
  left?: Property.Left
  top?: Property.Top
  position?: Property.Position
  height?: Property.Height
  width?: Property.Width
  bodercolor?: string
  visible?: boolean
}

const JGComponentContainer = (props: JGComponentContainerProps) => {
  const context = useContext()
  const {
    left,
    top,
    height,
    width,
    position,
    bodercolor,
    visible,
    ...resprops
  } = props

  return (
    <Box
      sx={{
        width: toWidth(width, context, '235px'),
        height: toHeight(height, context, '26px'),
        position: context.position,
        left: left,
        top: top,
        borderColor: bodercolor,
        borderStyle: 'solid',
        borderWidth: '1px',
        display: visible ? 'block' : 'none'
      }}
    ></Box>
  )
}

JGComponentContainer.defaultProps = {
  left: '20px',
  top: '50px',
  width: '200px',
  height: '200px',
  position: 'absolute',
  borderColor: '#999',
  visible: 'true'
}

export default JGComponentContainer
