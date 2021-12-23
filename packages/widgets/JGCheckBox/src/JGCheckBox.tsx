import Box from '@mui/material/Box'
import { Checkbox, CheckboxProps } from '@mui/material'
import { Property } from 'csstype'
import { useContext } from '@v-act/widget-context'
import { toHeight, toLabelWidth, toWidth } from '@v-act/widget-utils'
interface JGCheckBoxProps extends CheckboxProps {
  left?: Property.Left
  top?: Property.Top
  height?: Property.Height
  width?: Property.Width
  position?: Property.Position
  margin?: Property.Margin
  padding?: Property.Padding
  labeltext?: string
  readonly?: boolean
  ismust?: boolean
  labelVisible?: boolean
  labelWidth?: number
}

const JGCheckBox = (props: JGCheckBoxProps) => {
  const context = useContext()
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
    labelVisible,
    labelWidth,
    ...restProps
  } = props

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
      <Box
        sx={{
          width: labelVisible ? toLabelWidth(labelWidth, context, 94) : 0,
          fontSize: '12px',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          p: '0px 5px 0px 5px',
          flexShrink: '0',
          textAlign: 'right',
          display: labelVisible ? 'block' : 'none'
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
  top: 0,
  labelVisible: true,
  labelWidth: 100
}
export default JGCheckBox
export { JGCheckBox, JGCheckBoxProps }
