import { Control, toNumber, toBoolean } from '@v-act/schema-types'
import { JGCheckBoxGroup, JGCheckBoxGroupProps } from './JGCheckBoxGroup'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties
  const props: JGCheckBoxGroupProps = {
    top: toNumber(pros.top),
    left: toNumber(pros.left),
    labelText: pros.labelText,
    placeholder: pros.placeholder,
    visible: toBoolean(pros.visible, true),
    labelWidth: toNumber(pros.labelWidth),
    labelVisible: toBoolean(pros.labelVisible, true)
  }
  console.log(123)
  return <JGCheckBoxGroup {...props}></JGCheckBoxGroup>
}

export default JGCheckBoxGroup
export { JGCheckBoxGroup, convert }
