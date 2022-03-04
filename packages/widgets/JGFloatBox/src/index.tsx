import { Control } from '@v-act/schema-types'
import { useGetCompVal } from '@v-act/widget-utils'

import JGFloatBox from './JGFloatBox'

const JsonJGFloatBox = function (props: { control: Control }): JSX.Element {
  let propsTemp: Object = useGetCompVal(props.control)
  return <JGFloatBox {...propsTemp}></JGFloatBox>
}

export { JGFloatBox, JsonJGFloatBox }
