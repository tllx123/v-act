import { Property } from 'csstype'
import Box from '@mui/material/Box'
import { JGInputLabel } from '@v-act/jginputlabel'
import { FieldValue, useContext } from '@v-act/widget-context'
import styled from 'styled-components'
import {
  toHeight,
  toLabelWidth,
  toWidth,
  isNullOrUnDef,
  getFieldValue
} from '@v-act/widget-utils'
import { Input } from 'antd'
import { useState } from 'react'
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
  tableName?: string | null
  columnName?: string | null
  disabled?: boolean
}

const JGLongTextBox = (props: JGLongTextBoxProps) => {
  const context = useContext()
  const setFieldValue = context.setFieldValue

  let inputvalTemp: FieldValue = ''

  const [inputval, setInputValue] = useState<any>('')

  if (props.tableName && props.columnName) {
    inputvalTemp = getFieldValue(props.tableName, props.columnName, context)
    setInputValue(isNullOrUnDef(inputvalTemp) ? '' : inputvalTemp)
  }

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
    labelVisible,
    labelWidth,
    disabled
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
        defaultValue={inputval}
        value={inputval}
        disabled={isDisable}
        onChange={(e) => {
          setInputValue(e.target.value)
          if (props.tableName && props.columnName && setFieldValue) {
            setFieldValue(
              props.tableName,
              props.columnName,
              context,
              e.target.value
            )
          }
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
