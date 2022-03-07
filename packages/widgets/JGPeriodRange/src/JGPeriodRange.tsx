import Box from '@mui/material/Box'
import { DatePicker } from 'antd'
import { JGInputLabel } from '@v-act/jginputlabel'
import moment from 'moment'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import '../src/JGPeriodRange.css'
import 'moment/dist/locale/zh-cn'
import EventIcon from '@mui/icons-material/Event'
import { JGComponentProps } from '@v-act/schema-types'
moment.locale('zh-cn')
const { RangePicker } = DatePicker

interface JGPeriodRangeProps extends JGComponentProps {
  dateDisplay?: string
}

const JGPeriodRange = (props: JGPeriodRangeProps) => {
  const {
    left,
    top,
    height,
    width,
    position,
    labelWidth,
    labeltext,
    dateDisplay
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
        width: width,
        height: height,
        position: position,
        left: left,
        top: top
      }}
    >
      <JGInputLabel width={labelWidth} height={height}>
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

JGPeriodRange.defaultProps = {
  left: '20px',
  top: '50px',
  width: '200px',
  height: '200px',
  position: 'absolute'
}

export default JGPeriodRange
