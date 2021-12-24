import { Control } from '@v-act/schema-types'
import { toBoolean, toNumber } from '@v-act/widget-utils'

import { JGDateTimePicker, JGDateTimePickerProps } from './JGDateTimePicker'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties
  const props: JGDateTimePickerProps = {
    left: pros.left + 'px',
    top: pros.top + 'px',
    height: toNumber(pros.multiHeight) + 'px',
    width: toNumber(pros.multiWidth) + 'px',
    labeltext: pros.labelText,
    labelWidth: toNumber(pros.labelWidth, 94),
    readonly: toBoolean(pros.readOnly, false),
    ismust: toBoolean(pros.isMust, false),
    placeholder: pros.placeholder,
    disabled: !toBoolean(pros.enabled, true),
    labelVisible: toBoolean(pros.labelVisible, true)
  }
  return <JGDateTimePicker {...props}></JGDateTimePicker>
}

export { convert, JGDateTimePicker }
