import { Control } from '@v-act/schema-types'
import { useGetCompVal } from '@v-act/widget-utils'
import JGDateTimePicker from './JGDateTimePicker'

const JsonJGDateTimePicker = function (props: { control: Control }) {
  let propsTemp: Object = useGetCompVal(props.control, 'JGDateTimePicker')
  return <JGDateTimePicker {...propsTemp}></JGDateTimePicker>
}

export { JGDateTimePicker, JsonJGDateTimePicker }
