import { Control, toNumber, toBoolean } from '@v-act/schema-types'
import { JGFloatBox, JGFloatBoxProps } from './JGFloatBox'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element
): JSX.Element {
  const pros = control.properties
  const props: JGFloatBoxProps = {
    top: toNumber(pros.top),
    left: toNumber(pros.left),
    labelText: pros.labelText,
    isMust: toBoolean(pros.isMust),
    placeholder: pros.placeholder,
    visible: toBoolean(pros.visible),
    labelWidth: toNumber(pros.labelWidth),
    labelVisible: toBoolean(pros.labelVisible, true)
  }
  return <JGFloatBox {...props}></JGFloatBox>
}

export default JGFloatBox

export { JGFloatBox, convert }
