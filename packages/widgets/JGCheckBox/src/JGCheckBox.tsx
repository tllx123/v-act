import { Property } from 'csstype'
import { Checkbox, CheckboxProps } from '@mui/material'
import Box from '@mui/material/Box'
import { JGInputLabel } from '@v-act/jginputlabel'
import { FieldValue, useContext } from '@v-act/widget-context'
import {
  toHeight,
  toLabelWidth,
  toWidth,
  getFieldValue,
  isNullOrUnDef
} from '@v-act/widget-utils'
import Icon from '@mui/material/Icon'
interface JGCheckBoxProps extends CheckboxProps {
  left?: Property.Left
  top?: Property.Top
  height?: Property.Height
  width?: Property.Width
  position?: Property.Position
  margin?: Property.Margin
  padding?: Property.Padding
  labeltext?: string
  labelWidth?: number
  readonly?: boolean
  ismust?: boolean
  disabled?: boolean
  labelVisible?: boolean
  tableName?: string | null
  columnName?: string | null
  placeholder?: string
}

const JGCheckBox = (props: JGCheckBoxProps) => {
  const context = useContext()

  let checkedValue: any = false
  let value: FieldValue = ''
  if (props.tableName && props.columnName) {
    value = getFieldValue(props.tableName, props.columnName, context)
    value = isNullOrUnDef(value) ? '' : value
  }

  if (value) {
    checkedValue = true
  }

  const {
    left,
    top,
    height,
    width,
    labeltext,
    position,
    margin,
    padding,
    ismust,
    disabled,
    readonly,
    labelVisible,
    labelWidth,
    placeholder
  } = props

  let isDisable = false
  if (readonly || disabled) {
    isDisable = true
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: toWidth(width, context, '235px'),
        height: toHeight(height, context, '26px'),
        position: context.position,
        left: left,
        top: top,
        margin: margin,
        padding: padding
      }}
    >
      <JGInputLabel
        width={toLabelWidth(labelWidth, context, 94)}
        height={toHeight(height, context, '26px')}
        visible={labelVisible}
        required={ismust}
      >
        {labeltext}
      </JGInputLabel>
      <Box
        sx={{
          height: '100%!important',
          width: '100%',
          flexShrink: '1',
          border: '1px solid #dcdee2',
          color: '#333',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center'
        }}
        component="div"
      >
        <Box
          component={Checkbox}
          size="small"
          disableRipple={true}
          defaultChecked={checkedValue}
          disabled={isDisable}
        >
          {' '}
        </Box>
      </Box>
      <Box
        sx={{
          display: placeholder ? 'block' : 'none',
          color: '#999',
          fontSize: '14PX',
          flexShrink: '0'
        }}
      >
        {placeholder}
      </Box>
    </Box>
  )
}

JGCheckBox.defaultProps = {
  labeltext: '布尔',
  width: '235px',
  height: '26px',
  position: 'absolute',
  labelWidth: 94,
  left: 0,
  top: 0,
  labelVisible: true
}
export default JGCheckBox
export { JGCheckBox, type JGCheckBoxProps }
