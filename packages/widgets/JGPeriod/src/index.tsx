import { Control } from '@v-act/schema-types'
import { useGetCompVal } from '@v-act/widget-utils'

import JGPeriod from './JGPeriod'

const JsonJGPeriod = function (props: { control: Control }): JSX.Element {
  let periodType = {
    periodType: props.control.properties?.periodType || 'years'
  }
  let propsTemp: Object = Object.assign(
    useGetCompVal(props.control),
    periodType
  )
  console.log('propsTemp', propsTemp)
  return <JGPeriod {...propsTemp}></JGPeriod>
}

export { JGPeriod, JsonJGPeriod }
