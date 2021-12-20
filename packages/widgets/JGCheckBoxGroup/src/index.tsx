import { Control } from '@v-act/schema-types'
import {
  toBoolean,
  toNumber,
  valueofHeight,
  valueofWidth
} from '@v-act/widget-utils'

import { JGCheckBoxGroup, JGCheckBoxGroupProps } from './JGCheckBoxGroup'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties
  const props: JGCheckBoxGroupProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    labelText: pros.labelText,
    placeholder: pros.placeholder,
    visible: toBoolean(pros.visible, true),
    labelWidth: toNumber(pros.labelWidth),
    labelVisible: toBoolean(pros.labelVisible, true),
    multiWidth: valueofWidth(pros.multiWidth, '235px'),
    multiHeight: valueofHeight(pros.multiHeight, '26px')
  }
  console.log(123)
  return <JGCheckBoxGroup {...props}></JGCheckBoxGroup>
}

export default JGCheckBoxGroup
export { convert, JGCheckBoxGroup }
