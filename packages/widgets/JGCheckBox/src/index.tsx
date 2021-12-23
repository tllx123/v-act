import { Control, toBoolean, toNumber } from '@v-act/schema-types'

import { JGCheckBox, JGCheckBoxProps } from './JGCheckBox'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties
  const props: JGCheckBoxProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: toNumber(pros.multiWidth) + 'px',
    height: toNumber(pros.multiHeight) + 'px',
    ismust: toBoolean(pros.isMust, false),
    disabled: !toBoolean(pros.enabled, true),
    labelVisible: toBoolean(pros.labelVisible, true),
    labelWidth: toNumber(pros.labelWidth)
  }
  return <JGCheckBox {...props}></JGCheckBox>
}

export { convert, JGCheckBox }
