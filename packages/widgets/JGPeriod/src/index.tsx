import { Control, toNumber, toBoolean } from '@v-act/schema-types'
import { JGPeriod, JGPeriodProps } from './JGPeriod'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element
): JSX.Element {
  const pros = control.properties
  const props: JGPeriodProps = {
    top: toNumber(pros.top),
    left: toNumber(pros.left),
    labelText: pros.labelText,
    isMust: toBoolean(pros.isMust),
    placeholder: pros.placeholder,
    visible: toBoolean(pros.visible),
    labelWidth: toNumber(pros.labelWidth),
    labelVisible: toBoolean(pros.labelVisible, true)
  }
  return <JGPeriod {...props}></JGPeriod>
}

export default JGPeriod

export { JGPeriod, convert }
