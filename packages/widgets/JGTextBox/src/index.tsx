import { Control, toNumber, toBoolean } from '@v-act/schema-types'
import { JGTextBox, JGTextBoxProps } from './JGTextBox'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties
  const props: JGTextBoxProps = {
    top: toNumber(pros.top),
    left: toNumber(pros.left),
    labelText: pros.labelText,
    isMust: toBoolean(pros.isMust, false),
    placeholder: pros.placeholder,
    visible: toBoolean(pros.visible, true),
    labelWidth: toNumber(pros.labelWidth),
    labelVisible: toBoolean(pros.labelVisible, true),
    disabled: !toBoolean(pros.enabled, true)
  }
  return <JGTextBox {...props}></JGTextBox>
}

export default JGTextBox

export { JGTextBox, convert }
