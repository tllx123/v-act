import { Control } from '@v-act/schema-types'
import { useGetCompVal } from '@v-act/widget-utils'

import JGPassword from './JGPassword'

const JsonJGPassword = function (props: { control: Control }): JSX.Element {
  let propsTemp: Object = useGetCompVal(props.control)
  return <JGPassword {...propsTemp}></JGPassword>
}

export { JGPassword, JsonJGPassword }
