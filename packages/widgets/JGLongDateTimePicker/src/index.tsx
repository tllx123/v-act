import { Control } from '@v-act/schema-types'
import {
  toBoolean,
  toNumber,
  valueofWidth,
  valueofHeight
} from '@v-act/widget-utils'

import {
  JGLongDateTimePicker,
  JGLongDateTimePickerProps
} from './JGLongDateTimePicker'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties
  const props: JGLongDateTimePickerProps = {
    left: pros.left + 'px',
    top: pros.top + 'px',
    width: valueofWidth(pros.multiWidth, '235px'),
    height: valueofHeight(pros.multiHeight, '26px'),
    labeltext: pros.labelText,
    labelWidth: toNumber(pros.labelWidth, 94),
    readonly: toBoolean(pros.readOnly, false),
    ismust: toBoolean(pros.isMust, false),
    placeholder: pros.placeholder,
    disabled: !toBoolean(pros.enabled, true),
    labelVisible: toBoolean(pros.labelVisible, true)
  }
  return <JGLongDateTimePicker {...props}></JGLongDateTimePicker>
}

export { convert, JGLongDateTimePicker }
