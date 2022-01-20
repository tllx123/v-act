import { Control } from '@v-act/schema-types'
import {
  toBoolean,
  toNumber,
  valueofWidth,
  valueofHeight,
  getColumnName,
  getTableName
} from '@v-act/widget-utils'
import { JGDateRangePicker, JGDateRangePickerProps } from './JGDateRangePicker'

const convert = function (control: Control): JSX.Element {
  console.log(control.properties.labelText)
  console.log('control')
  console.log(control)

  const pros = control.properties
  const props: JGDateRangePickerProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: valueofWidth(pros.multiWidth, '235px'),
    height: valueofHeight(pros.multiHeight, '26px'),
    labeltext: pros.labelText,
    labelWidth: toNumber(pros.labelWidth, 94),
    tableName: getTableName(control),
    columnName: getColumnName(control),
    dateDisplay: pros.dateDisplay
  }
  return <JGDateRangePicker {...props}></JGDateRangePicker>
}

export { convert, JGDateRangePicker }
