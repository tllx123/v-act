import * as React from 'react'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { DateTimePicker, DateTimePickerProps } from '@mui/lab'
import zhCN from 'date-fns/locale/zh-CN'
import Box from '@mui/material/Box'
interface JGLongDateTimePickerProps extends DateTimePickerProps {
  left?: number
  top?: number
  width?: number
  isMust?: boolean
  labeltext?: string
  position?: string
  margin?: string
  padding?: string
  placeholder?: string
  readonly?: boolean
}

const JGLongDateTimePicker = (props: JGLongDateTimePickerProps) => {
  const {
    left,
    top,
    width,
    isMust,
    labeltext,
    position,
    margin,
    padding,
    placeholder,
    readonly,
    ...restProps
  } = props
  const [value, setValue] = React.useState<Date | null>(null)
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
              width: width,
              position: position,
              left: left,
              top: top,
              margin: margin,
              padding: padding,
              height: '26px',
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
              {isMust ? <label style={{ color: 'red' }}>*</label> : ''}
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
  placeholder: 'wahaha'
}

export default JGLongDateTimePicker
