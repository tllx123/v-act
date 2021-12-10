import { Control, toNumber, toBoolean } from '@v-act/schema-types'
import { JGPercent, JGPercentProps } from './JGPercent'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties
  const props: JGPercentProps = {
    top: toNumber(pros.top),
    left: toNumber(pros.left),
    placeholder: pros.placeholder,
    visible: toBoolean(pros.visible, true)
  }
  return <JGPercent {...props}></JGPercent>
}

export default JGPercent
export { JGPercent, convert }
