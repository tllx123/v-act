import { Control, toNumber, toBoolean } from '@v-act/schema-types'
import { JGRadioGroup, JGRadioGroupProps } from './JGRadioGroup'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties
  const props: JGRadioGroupProps = {
    top: toNumber(pros.top),
    left: toNumber(pros.left),
    labelText: pros.labelText,
    placeholder: pros.placeholder,
    visible: toBoolean(pros.visible, true),
    labelWidth: toNumber(pros.labelWidth),
    labelVisible: toBoolean(pros.labelVisible, true)
  }
  console.log(123)
  return <JGRadioGroup {...props}></JGRadioGroup>
}

export default JGRadioGroup
export { JGRadioGroup, convert }
