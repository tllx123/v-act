import {
  Control,
  WidgetRenderContext,
  WidgetRenderer
} from '@v-act/schema-types'
import {
  getColumnName,
  getTableName,
  toNumber,
  valueofHeight,
  valueofWidth
} from '@v-act/widget-utils'

import { JGPeriodRange, JGPeriodRangeProps } from './JGPeriodRange'

const JsonJGPeriodRange = function (props: {
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

export { convert, JGPeriodRange, JsonJGPeriodRange }
