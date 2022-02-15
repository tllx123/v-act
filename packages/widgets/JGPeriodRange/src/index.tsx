import { Control } from '@v-act/schema-types'
import {
  toBoolean,
  toNumber,
  valueofWidth,
  valueofHeight,
  getColumnName,
  getTableName
} from '@v-act/widget-utils'
import { JGPeriodRange, JGPeriodRangeProps } from './JGPeriodRange'

const convert = function (control: Control): JSX.Element {
  console.log(control.properties.labelText)
  console.log('control')
  console.log(control)

  const pros = control.properties
  const props: JGPeriodRangeProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: valueofWidth(pros.multiWidth, '235px'),
    height: valueofHeight(pros.multiHeight, '32px'),
    labeltext: pros.labelText,
    labelWidth: toNumber(pros.labelWidth, 94),
    tableName: getTableName(control),
    columnName: getColumnName(control),
    dateDisplay: pros.dateDisplay
  }
  return <JGPeriodRange {...props}></JGPeriodRange>
}

export { convert, JGPeriodRange }
