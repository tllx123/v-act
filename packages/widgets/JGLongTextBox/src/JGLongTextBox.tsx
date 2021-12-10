import { TextareaAutosize, TextareaAutosizeProps } from '@mui/base'
import Box from '@mui/material/Box'
import { Property } from 'csstype'
interface JGLongTextBoxProps extends TextareaAutosizeProps {
  left?: Property.Left
  top?: Property.Top
  height?: Property.Height
  width?: Property.Width
  position?: Property.Position
  margin?: Property.Margin
  padding?: Property.Padding

  readonly?: boolean
  ismust?: boolean
  labeltext?: string
  placeholder?: string
}

const JGLongTextBox = (props: JGLongTextBoxProps) => {
  const {
    left,
    top,
    height,
    width,
    ismust,
    labeltext,
    position,
    margin,
    padding,
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
        padding: padding,
        pointerEvents: readonly ? 'none' : 'auto'
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
          textAlign: 'right',
          flexShrink: '0'
        }}
      >
        {labeltext}
        {ismust ? <label style={{ color: 'red' }}>*</label> : ''}{' '}
      </Box>
      <Box
        sx={{
          'resize': 'none',
          'height': '100%!important',
          'width': '100%',
          'flexShrink': '1',
          'border': '1px solid #dcdee2',
          'color': '#333',
          'borderRadius': '4px',
          '&:hover': {
            borderColor: '#356abb'
          },
          '&:focus': {
            borderColor: '#356abb',
            background: '#fff',
            boxShadow: '0 0 0 2px rgba(53, 106, 187, 0.3)',
            outline: 'none'
          },
          '&:disabled': {
            background: '#f6f7fb'
          }
        }}
        component={TextareaAutosize}
        {...restProps}
      ></Box>
    </Box>
  )
}

JGLongTextBox.defaultProps = {
  labeltext: '文本',
  width: '250px',
  height: '50px',
  position: 'absolute',
  left: 0,
  top: 0,
  placeholder: ''
}

export default JGLongTextBox
export { JGLongTextBox, JGLongTextBoxProps }
