import { Control } from '@v-act/schema-types'
import { useGetCompVal } from '@v-act/widget-utils'
import JGPeriodRange from './JGPeriodRange'

const JsonJGPeriodRange = function (props: { control: Control }) {
  let control = props.control
  let propsTemp = useGetCompVal(control)

  console.log('control')
  console.log(control)
  console.log('propsTemp.prop')
  console.log(propsTemp.value)
  return <JGPeriodRange {...propsTemp}></JGPeriodRange>
}

export { JGPeriodRange, JsonJGPeriodRange }
