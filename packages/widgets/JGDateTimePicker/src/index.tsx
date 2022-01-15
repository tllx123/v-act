import { Control } from '@v-act/schema-types'
import {
  toBoolean,
  toNumber,
  valueofWidth,
  valueofHeight,
  getColumnName,
  getTableName
} from '@v-act/widget-utils'

import { JGDateTimePicker, JGDateTimePickerProps } from './JGDateTimePicker'

const convert = function (control: Control): JSX.Element {
  console.log(control.properties.labelText)
  console.log('control')
  console.log(control)

  const pros = control.properties
  const props: JGDateTimePickerProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: valueofWidth(pros.multiWidth, '235px'),
    height: valueofHeight(pros.multiHeight, '26px'),
    labeltext: pros.labelText,
    labelWidth: toNumber(pros.labelWidth, 94),
    readonly: toBoolean(pros.readOnly, false),
    ismust: toBoolean(pros.isMust, false),
    placeholder: pros.placeholder,
    disabled: !toBoolean(pros.enabled, true),
    labelVisible: toBoolean(pros.labelVisible, true),
    tableName: getTableName(control),
    columnName: getColumnName(control),
    dateDisplay: pros.dateDisplay
  }
  return <JGDateTimePicker {...props}></JGDateTimePicker>
}

export { convert, JGDateTimePicker }
