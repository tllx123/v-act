import Box from '@mui/material/Box'
import { Property } from 'csstype'
import { useContext } from '@v-act/widget-context'
import { toHeight, toLabelWidth, toWidth } from '@v-act/widget-utils'
import { DatePicker } from 'antd'
import { JGInputLabel } from '@v-act/jginputlabel'
import moment from 'moment'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import '../src/JGPeriodRange.css'
import 'moment/dist/locale/zh-cn'

moment.locale('zh-cn')
import EventIcon from '@mui/icons-material/Event'
const { RangePicker } = DatePicker

interface JGPeriodRangeProps {
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

const JGPeriodRange = (props: JGPeriodRangeProps) => {
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
        height: toHeight(height, context, '26px'),
        position: context.position,
        left: left,
        top: top
      }}
    >
      <JGInputLabel
        width={toLabelWidth(labelWidth, context, 94)}
        height={toHeight(height, context, '26px')}
      >
        {labeltext}
      </JGInputLabel>
      <RangePicker
        suffixIcon={<EventIcon sx={{ color: '#333' }} />}
        locale={locale}
        picker={pickerVak}
      />
    </Box>
  )
}

JGPeriodRange.defaultProps = {
  left: '20px',
  top: '50px',
  width: '200px',
  height: '200px',
  position: 'absolute'
}

export default JGPeriodRange
export { JGPeriodRange, type JGPeriodRangeProps }
