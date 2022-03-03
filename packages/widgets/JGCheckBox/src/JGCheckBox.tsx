import Checkbox from '@mui/material/Checkbox'
import Box from '@mui/material/Box'
import { JGInputLabel } from '@v-act/jginputlabel'
import { JGComponentProps } from '@v-act/schema-types'

const JGCheckBox = (props: JGComponentProps) => {
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
    placeholder,
    value,
    onChanged
  } = props

  let isDisable = false
  if (readonly || disabled) {
    isDisable = true
  }
  console.log('Boolean(value)')
  console.log(Boolean(value))

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: width,
        height: height,
        position: position,
        left: left,
        top: top,
        margin: margin,
        padding: padding
      }}
    >
      <JGInputLabel
        width={labelWidth}
        height={height}
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
          value={value}
          checked={value === undefined ? value : Boolean(value)}
          disabled={isDisable}
          onChange={(e: Object) => {
            if (value != undefined) {
              onChanged && onChanged(e)
            }
          }}
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
