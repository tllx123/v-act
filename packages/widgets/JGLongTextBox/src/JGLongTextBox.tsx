import { ChangeEvent } from 'react'

import { Input } from 'antd'
import { Property } from 'csstype'
import styled from 'styled-components'

import Box from '@mui/material/Box'
import { JGInputLabel } from '@v-act/jginputlabel'
import { useContext } from '@v-act/widget-context'
import { toHeight, toLabelWidth, toWidth } from '@v-act/widget-utils'

const { TextArea } = Input

export interface JGLongTextBoxProps {
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
  labelWidth?: number
  placeholder?: string
  labelVisible?: boolean
  disabled?: boolean
  value?: string
  onChanged?: (e: ChangeEvent) => void
}

const JGLongTextBox = (props: JGLongTextBoxProps) => {
  const context = useContext()
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
        width: toWidth(width, context, '235px'),
        height: toHeight(height, context, '26px'),
        position: context.position,
        left: left,
        top: top,
        margin: margin,
        padding: padding,
        pointerEvents: readonly ? 'none' : 'auto'
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

      <VactTextArea
        //defaultValue={val.valName}
        value={value}
        disabled={isDisable}
        onChange={(e: ChangeEvent) => {
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
