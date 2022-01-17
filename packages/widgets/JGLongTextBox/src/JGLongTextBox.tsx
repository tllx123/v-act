import { Property } from 'csstype'

import { TextareaAutosize, TextareaAutosizeProps } from '@mui/base'
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

export interface JGLongTextBoxProps extends TextareaAutosizeProps {
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

  let defaultValue: any = ''
  let value: FieldValue = ''
  if (props.tableName && props.columnName) {
    value = getFieldValue(props.tableName, props.columnName, context)
    value = isNullOrUnDef(value) ? '' : value
  }

  if (value) {
    defaultValue = value
  }

  // console.log("---value---")
  // console.log(value)

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
        defaultValue={defaultValue}
        disabled={isDisable}
      ></Box>
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

export default JGLongTextBox
