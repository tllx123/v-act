import Box from '@mui/material/Box'
import { Property } from 'csstype'
import { FieldValue, useContext } from '@v-act/widget-context'
import {
  toHeight,
  toWidth,
  getFieldValue,
  isNullOrUnDef
} from '@v-act/widget-utils'

export interface JGComponentContainerProps {
  left?: Property.Left
  top?: Property.Top
  position?: Property.Position
  height?: Property.Height
  width?: Property.Width
  bodercolor?: string
  visible?: boolean
  tableName?: string | null
  columnName?: string | null
}

const JGComponentContainer = (props: JGComponentContainerProps) => {
  const context = useContext()

  let defulValue: any = null
  let value: FieldValue = ''
  if (props.tableName && props.columnName) {
    value = getFieldValue(props.tableName, props.columnName, context)
    value = isNullOrUnDef(value) ? '' : value
  }

  if (value) {
    defulValue = value
  }
  console.log('---value---')
  console.log(value)

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
  left: '0px',
  top: '0px',
  width: '200px',
  height: '200px',
  position: 'absolute',
  borderColor: '#999',
  visible: 'true'
}

export default JGComponentContainer
