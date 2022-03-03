import { Control } from '@v-act/schema-types'
import { useGetCompVal } from '@v-act/widget-utils'

import JGLongDateTimePicker from './JGLongDateTimePicker'

const JsonJGLongDateTimePicker = function (props: { control: Control }) {
  let propsTemp: Object = useGetCompVal(props.control, 'JGLongDateTimePicker')
  return <JGLongDateTimePicker {...propsTemp}></JGLongDateTimePicker>
}

export { JGLongDateTimePicker, JsonJGLongDateTimePicker }
