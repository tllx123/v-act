import Box from '@mui/material/Box'
import { Property } from 'csstype'

interface JGPortalEditProps {
  left?: Property.Left
  top?: Property.Top
  position?: Property.Position
  height?: Property.Height
  width?: Property.Width
  backColor?: string
}

const JGPortalEdit = (props: JGPortalEditProps) => {
  const { left, position, top, width, height, backColor } = props

  return (
    <Box
      sx={{
        left: left,
        top: top,
        position: position,
        width: width,
        height: height,
        backgroundColor: backColor
      }}
      component="div"
    />
  )
}

JGPortalEdit.defaultProps = {
  left: '20px',
  top: '50px',
  position: 'absolute',
  width: '200px',
  height: '200px'
}

export default JGPortalEdit
export { JGPortalEdit, JGPortalEditProps }
