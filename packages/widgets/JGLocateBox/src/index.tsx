import { Control, toNumber, toBoolean } from '@v-act/schema-types'
import { JGLocateBox, JGLocateBoxProps } from './JGLocateBox'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties
  const props: JGLocateBoxProps = {
    top: toNumber(pros.top),
    left: toNumber(pros.left),
    hint: pros.hint ? pros.hint : undefined,
    visible: toBoolean(pros.visible, true),
    disabled: !toBoolean(pros.enabled, true)
  }
  return <JGLocateBox {...props}></JGLocateBox>
}

export default JGLocateBox

export { JGLocateBox, convert }
