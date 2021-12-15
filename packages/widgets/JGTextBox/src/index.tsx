import {
  Control,
  toBoolean,
  toNumber,
  valueofHeight,
  valueofWidth
} from '@v-act/schema-types'

import { JGTextBox, JGTextBoxProps } from './JGTextBox'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties
  const props: JGTextBoxProps = {
    top: toNumber(pros.top),
    left: toNumber(pros.left),
    multiWidth: valueofWidth(pros.multiWidth, '235px'),
    multiHeight: valueofHeight(pros.multiHeight, '26px'),
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

export { convert, JGTextBox }
