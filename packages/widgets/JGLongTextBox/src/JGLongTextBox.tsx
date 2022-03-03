import { Input } from 'antd'
import styled from 'styled-components'
import Box from '@mui/material/Box'
import { JGInputLabel } from '@v-act/jginputlabel'
import { JGComponentProps } from '@v-act/schema-types'

const { TextArea } = Input

const JGLongTextBox = (props: JGComponentProps) => {
  const {
    left,
    top,
    height,
    width,
    ismust,
    labeltext,
    margin,
    padding,
    readonly,
    labelVisible,
    labelWidth,
    disabled,
    position,
    value,
    onChanged
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
      <JGInputLabel
        width={labelWidth}
        height={height}
        visible={labelVisible}
        required={ismust}
      >
        {labeltext}
      </JGInputLabel>

      <VactTextArea
        defaultValue={value}
        value={value}
        disabled={isDisable}
        onChange={(e) => {
          onChanged && onChanged(e)
        }}
      ></VactTextArea>
    </Box>
  )
}

JGLongTextBox.defaultProps = {
  labeltext: '文本',
  width: '235px',
  height: '26px',
  position: 'absolute',
  left: 0,
  top: 0,
  placeholder: '',
  labelVisible: true,
  labelWidth: 94
}
const VactTextArea = styled(TextArea)`
border: 1px solid #dcdee2 !important;
color: #333!important;
border-radius: 4px;
padding: 0 4px!important;
width: 100%!important;
flexShrink': 1!important;
resize:none;
outline: none!important;
height: 100%!important;
&:hover {
  border-color: #356abb!important;
}

&:focus {
  border-color: #356abb!important;
  background: #fff!important;
  box-shadow: 0 0 0 2px rgba(53, 106, 187, 0.3)!important;
  outline: none!important;
}

[disabled] {
  background: #f6f7fb!important;
}
`

export default JGLongTextBox
