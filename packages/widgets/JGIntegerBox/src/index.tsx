import { Control, toBoolean, toNumber } from '@v-act/schema-types'

import { JGIntegerBox, JGIntegerBoxProps } from './JGIntegerBox'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element
): JSX.Element {
  const pros = control.properties
  const props: JGIntegerBoxProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: toNumber(pros.multiWidth) + 'px',
    height: toNumber(pros.multiHeight) + 'px',
    labelText: pros.labelText,
    isMust: toBoolean(pros.isMust),
    placeholder: pros.placeholder,
    visible: toBoolean(pros.visible, true),
    labelWidth: toNumber(pros.labelWidth),
    labelVisible: toBoolean(pros.labelVisible, true)
  }
  return <JGIntegerBox {...props}></JGIntegerBox>
}

export default JGIntegerBox

export { convert, JGIntegerBox }
