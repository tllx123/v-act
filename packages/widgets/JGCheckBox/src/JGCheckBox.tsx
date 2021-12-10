import Box from '@mui/material/Box'
import { Checkbox, CheckboxProps } from '@mui/material'

interface JGCheckBoxProps extends CheckboxProps {
  left?: number
  top?: number
  height?: number
  width?: number
  labeltext?: string
  position?: string
  margin?: string
  padding?: string
  readonly?: boolean
  ismust?: boolean
}

const JGCheckBox = (props: JGCheckBoxProps) => {
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
    readonly,
    ...restProps
  } = props

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
      <Box
        sx={{
          width: '100px',
          fontSize: '12px',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          p: '0px 5px 0px 5px',
          flexShrink: '0',
          textAlign: 'right'
        }}
      >
        {labeltext}
        {ismust ? <label style={{ color: 'red' }}>*</label> : ''}
      </Box>

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
          sx={{
            pointerEvents: readonly ? 'none' : 'auto'
          }}
          component={Checkbox}
          size="small"
          disableRipple={true}
          {...restProps}
        >
          {' '}
        </Box>
      </Box>
    </Box>
  )
}

JGCheckBox.defaultProps = {
  labeltext: '布尔',
  width: '250px',
  height: '26px',
  position: 'absolute',
  left: 0,
  top: 0
}

export default JGCheckBox
