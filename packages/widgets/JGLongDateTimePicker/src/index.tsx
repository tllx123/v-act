import {
  JGLongDateTimePicker,
  JGLongDateTimePickerProps
} from './JGLongDateTimePicker'
import { Control, toNumber, toBoolean } from '@v-act/schema-types'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties
  const props: JGLongDateTimePickerProps = {
    left: pros.left + 'px',
    top: pros.top + 'px',
    height: pros.multiHeight + 'px',
    width: pros.multiWidth + 'px',
    position: 'absolute',
    labeltext: pros.labelText,
    readonly: toBoolean(pros.readOnly, false),
    ismust: toBoolean(pros.isMust, false),
    placeholder: pros.placeholder,
    disabled: !toBoolean(pros.enabled, true)
  }
  return <JGLongDateTimePicker {...props}></JGLongDateTimePicker>
}

export { JGLongDateTimePicker, convert }
