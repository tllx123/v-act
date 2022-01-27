import Box from '@mui/material/Box'
import { Property } from 'csstype'
import { useContext } from '@v-act/widget-context'
import { toHeight, toLabelWidth, toWidth } from '@v-act/widget-utils'
import { DatePicker } from 'antd'
import { JGInputLabel } from '@v-act/jginputlabel'
import moment from 'moment'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import '../src/JGDateRangePicker.css'
import 'moment/dist/locale/zh-cn'
import EventIcon from '@mui/icons-material/Event'
moment.locale('zh-cn')
const { RangePicker } = DatePicker

interface JGDateRangePickerProps {
  left?: Property.Left
  top?: Property.Top
  position?: Property.Position
  height?: Property.Height
  width?: Property.Width
  labeltext?: string
  labelWidth?: number
  tableName?: string | null
  columnName?: string | null
  dateDisplay?: string
}

const JGDateRangePicker = (props: JGDateRangePickerProps) => {
  const context = useContext()
  const {
    left,
    top,
    height,
    width,
    position,
    labelWidth,
    labeltext,
    dateDisplay,
    ...resprops
  } = props

  let pickerVak: any = 'date'

  if (dateDisplay) {
    pickerVak = dateDisplay
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: toWidth(width, context, '235px'),
        height: toHeight(height, context, '32px'),
        position: context.position,
        left: left,
        top: top
      }}
    >
      <JGInputLabel
        width={toLabelWidth(labelWidth, context, 94)}
        height={toHeight(height, context, '32px')}
      >
        {labeltext}
      </JGInputLabel>
      <RangePicker
        style={{
          width: '100%',
          height: '100%',
          border: '1px solid #dcdee2 !important'
        }}
        suffixIcon={<EventIcon sx={{ color: 'rgba(0, 0, 0, 0.54)' }} />}
        locale={locale}
        picker={pickerVak}
      />
    </Box>
  )
}

JGDateRangePicker.defaultProps = {
  left: '20px',
  top: '50px',
  width: '400px',
  height: '80px',
  position: 'absolute'
}

export default JGDateRangePicker
export { JGDateRangePicker, type JGDateRangePickerProps }
