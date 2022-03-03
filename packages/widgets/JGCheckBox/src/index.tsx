import { Control } from '@v-act/schema-types'
import { useGetCompVal } from '@v-act/widget-utils'
import JGCheckBox from './JGCheckBox'

const JsonJGCheckBox = function (props: { control: Control }) {
  let propsTemp: Object = useGetCompVal(props.control, 'JGCheckBox')
  return <JGCheckBox {...propsTemp}></JGCheckBox>
}

export { JGCheckBox, JsonJGCheckBox }
