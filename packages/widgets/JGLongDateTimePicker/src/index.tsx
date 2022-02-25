import {
  Control,
  WidgetRenderContext,
  WidgetRenderer
} from '@v-act/schema-types'
import {
  getColumnName,
  getTableName,
  toBoolean,
  toNumber,
  valueofHeight,
  valueofWidth
} from '@v-act/widget-utils'

import {
  JGLongDateTimePicker,
  JGLongDateTimePickerProps
} from './JGLongDateTimePicker'

const JsonJGLongDateTimePicker = function (props: {
  control: Control
  render: WidgetRenderer
  componentCode: string
  context: WidgetRenderContext
}) {
  return convert(props.control)
}

const convert = function (control: Control): JSX.Element {
  console.log(control.properties.labelText)
  console.log('control')
  console.log(control)

  const pros = control.properties
  const props: JGLongDateTimePickerProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: valueofWidth(pros.multiWidth, '235px'),
    height: valueofHeight(pros.multiHeight, '26px'),
    labeltext: pros.labelText,
    labelWidth: toNumber(pros.labelWidth, 94),
    ismust: toBoolean(pros.isMust, false),
    placeholder: pros.placeholder,
    disabled: !toBoolean(pros.enabled, true),
    labelVisible: toBoolean(pros.labelVisible, true),
    readonly: toBoolean(pros.readOnly, false),
    tableName: getTableName(control),
    columnName: getColumnName(control),
    maxDate: pros.maxDate,
    minDate: pros.minDate
  }
  return <JGLongDateTimePicker {...props}></JGLongDateTimePicker>
}

export { convert, JGLongDateTimePicker, JsonJGLongDateTimePicker }
