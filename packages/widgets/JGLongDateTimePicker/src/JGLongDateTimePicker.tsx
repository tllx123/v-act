import zhCN from 'date-fns/locale/zh-CN'
import { useState } from 'react'
import { parseISO } from 'date-fns'
import { DateTimePicker } from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import Box from '@mui/material/Box'
import { JGInputLabel } from '@v-act/jginputlabel'
import { JGComponentProps } from '@v-act/schema-types'

interface JGLongDateTimePickerProps extends JGComponentProps {
  onChangedForDate?: (e: any) => void
  maxDate?: string
  minDate?: string
}

const JGLongDateTimePicker = (props: JGLongDateTimePickerProps) => {
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
    maxDate,
    minDate,
    value,
    onChangedForDate,
    ...restProps
  } = props

  let maxDateTemp: any
  let minDateTemp: any
  if (maxDate) {
    maxDateTemp = parseISO(maxDate)
  }

  if (minDate) {
    minDateTemp = parseISO(minDate)
  }

  const [valueTemp, setValue] = useState()

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={zhCN}>
      <DateTimePicker
        {...restProps}
        maxDate={maxDateTemp}
        minDate={minDateTemp}
        inputFormat="yyyy-MM-dd HH:mm:ss"
        value={value == undefined ? valueTemp : value}
        onChange={(newValue) => {
          if (value) {
            onChangedForDate && onChangedForDate(newValue)
          } else {
            setValue(newValue)
          }
        }}
        renderInput={({ inputRef, inputProps, InputProps }) => (
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
            <Box
              sx={{
                'width': '100%',
                'height': '100%',
                'display': 'flex',
                'alignItems': 'center',
                'border': '1px solid #dcdee2',
                'color': '#333',
                'borderRadius': '4px',
                'paddingLeft': '5px',
                'paddingRight': '5px',
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
  width: '235px',
  labelWidth: 94,
  position: 'absolute',
  left: 0,
  top: 0,
  placeholder: '请选择日期',
  labelVisible: true,
  height: '26px'
}

export default JGLongDateTimePicker
