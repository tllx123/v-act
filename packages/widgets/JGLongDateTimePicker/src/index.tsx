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
  valueofWidth,
  getCompVal
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
  let val = getCompVal(props.control)
  props.control.val = {
    valName: val.val,
    tableName: val.tableName,
    columnName: val.columnName
  }
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
    val: control.val,
    maxDate: pros.maxDate,
    minDate: pros.minDate
  }
  return <JGLongDateTimePicker {...props}></JGLongDateTimePicker>
}

export { convert, JGLongDateTimePicker, JsonJGLongDateTimePicker }
