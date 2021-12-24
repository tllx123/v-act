import { Control } from '@v-act/schema-types'
import { toBoolean, toNumber } from '@v-act/widget-utils'

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
    labelWidth: toNumber(pros.labelWidth, 94),
    labelVisible: toBoolean(pros.labelVisible, true)
  }
  return <JGCheckBox {...props}></JGCheckBox>
}

export { convert, JGCheckBox }
