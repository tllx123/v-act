import { Control, toBoolean, toNumber } from '@v-act/schema-types'

import { JGLocateBox, JGLocateBoxProps } from './JGLocateBox'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties
  const props: JGLocateBoxProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: toNumber(pros.multiWidth) + 'px',
    height: toNumber(pros.multiHeight) + 'px',
    hint: pros.hint ? pros.hint : undefined,
    visible: toBoolean(pros.visible, true),
    disabled: !toBoolean(pros.enabled, true)
  }
  return <JGLocateBox {...props}></JGLocateBox>
}

export default JGLocateBox

export { convert, JGLocateBox }
