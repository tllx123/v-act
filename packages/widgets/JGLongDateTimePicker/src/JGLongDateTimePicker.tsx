import * as React from 'react'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { DateTimePicker, DateTimePickerProps } from '@mui/lab'
import zhCN from 'date-fns/locale/zh-CN'
import Box from '@mui/material/Box'
import { Property } from 'csstype'
import { useContext } from '@v-act/widget-context'
import { toHeight, toLabelWidth, toWidth } from '@v-act/widget-utils'
interface JGLongDateTimePickerProps extends DateTimePickerProps {
  left?: Property.Left
  top?: Property.Top
  width?: Property.Width
  height?: Property.Height
  position?: Property.Position
  margin?: Property.Margin
  padding?: Property.Padding
  ismust?: boolean
  labeltext?: string
  placeholder?: string
  readonly?: boolean
  labelVisible?: boolean
  labelWidth?: number
}

const JGLongDateTimePicker = (props: JGLongDateTimePickerProps) => {
  const context = useContext()
  const {
    left,
    top,
    width,
    height,
    ismust,
    labeltext,
    position,
    margin,
    padding,
    placeholder,
    readonly,
    labelVisible,
    labelWidth,
    ...restProps
  } = props
  const [value, setValue] = React.useState<any>(null)
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={zhCN}>
      <DateTimePicker
        {...restProps}
        value={value}
        onChange={(newValue) => {
          setValue(newValue)
        }}
        renderInput={({ inputRef, inputProps, InputProps }) => (
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
            <Box
              sx={{
                width: labelVisible ? toLabelWidth(labelWidth, context, 94) : 0,
                fontSize: '12px',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                p: '0px 5px 0px 5px',
                textAlign: 'right',
                flexShrink: '0',
                display: labelVisible ? 'block' : 'none'
              }}
            >
              {labeltext}
              {ismust ? <label style={{ color: 'red' }}>*</label> : ''}
            </Box>
            <Box
              sx={{
                'width': '100%',
                'display': 'flex',
                'alignItems': 'center',
                'border': '1px solid #dcdee2',
                'color': '#333',
                'borderRadius': '4px',
                'padding': '5px',
                'flexShrink': '1',
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
            >
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  outline: 'none'
                }}
                component="input"
                type="date"
                ref={inputRef}
                {...inputProps}
                placeholder={placeholder}
              />
              {InputProps?.endAdornment}
            </Box>
          </Box>
        )}
      />
    </LocalizationProvider>
  )
}

JGLongDateTimePicker.defaultProps = {
  labeltext: '文本',
  width: '250px',
  position: 'absolute',
  left: 0,
  top: 0,
  placeholder: '请选择日期',
  labelVisible: true,
  labelWidth: 94
}

export default JGLongDateTimePicker
export { JGLongDateTimePicker, JGLongDateTimePickerProps }
