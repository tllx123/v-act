import { Control } from '@v-act/schema-types'
import { useGetCompVal } from '@v-act/widget-utils'

import JGIntegerBox from './JGIntegerBox'

const JsonJGIntegerBox = function (props: { control: Control }): JSX.Element {
  let propsTemp: Object = useGetCompVal(props.control)
  return <JGIntegerBox {...propsTemp}></JGIntegerBox>
}

export { JGIntegerBox, JsonJGIntegerBox }
