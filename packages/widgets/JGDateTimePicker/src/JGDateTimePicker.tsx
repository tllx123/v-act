import { format } from 'date-fns'
import { useState } from 'react'
import zhCN from 'date-fns/locale/zh-CN'
import { DatePicker } from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import Box from '@mui/material/Box'
import { JGInputLabel } from '@v-act/jginputlabel'
import { JGComponentProps } from '@v-act/schema-types'

interface JGDateTimePickerProps extends JGComponentProps {
  dateDisplay?: string
}

const JGDateTimePicker = (props: JGDateTimePickerProps) => {
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
    dateDisplay,
    value,
    onChanged,
    ...restProps
  } = props

  const [valueTemp, setValue] = useState(undefined)

  let viewsValue: any = ['year', 'month', 'day']

  if (dateDisplay === 'month') {
    viewsValue = ['year', 'month']
  } else if (dateDisplay === 'year') {
    viewsValue = ['year']
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={zhCN}>
      <DatePicker
        {...restProps}
        views={viewsValue}
        disableMaskedInput
        inputFormat="yyyy-MM-dd"
        value={value == undefined ? valueTemp : value}
        onChange={(newValue) => {
          let curr: any = ''
          curr = format(newValue, 'yyyy-MM-dd')
          if (dateDisplay === 'month') {
            curr = curr.slice(0, 7) + '-01'
            curr = new Date(curr)
          } else if (dateDisplay === 'year') {
            curr = curr.slice(0, 4) + '-01-01'
            curr = new Date(curr)
          } else {
            curr = newValue
          }

          if (value) {
            console.log(1)
            onChanged && onChanged(curr)
          } else {
            console.log(2)
            setValue(curr)
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

JGDateTimePicker.defaultProps = {
  labeltext: '文本',
  width: '250px',
  position: 'absolute',
  left: 0,
  top: 0,
  placeholder: '请选择日期',
  labelVisible: true,
  labelWidth: 94,
  height: '26px'
}

export default JGDateTimePicker
