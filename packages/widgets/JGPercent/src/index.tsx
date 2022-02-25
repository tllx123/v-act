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

import { JGPercent, JGPercentProps } from './JGPercent'

const JsonJGPercent = function (props: {
  control: Control
  render: WidgetRenderer
  componentCode: string
  context: WidgetRenderContext
}) {
  return convert(props.control, props.render)
}

const convert = function (
  control: Control,
  render: WidgetRenderer
): JSX.Element {
  console.log('@@@@@@@@@@@@@@@:JGPercent')
  console.log(control)
  const pros = control.properties
  const props: JGPercentProps = {
    code: pros.code,
    alias: pros.alias,
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    visible: toBoolean(pros.visible, true),
    dock: pros.dock,
    multiWidth: valueofWidth(pros.multiWidth, '235px'),
    multiHeight: valueofHeight(pros.multiHeight, '26px'),
    fontColor: pros.fontColor,
    frontColor: pros.frontColor,
    tableName: getTableName(control),
    columnName: getColumnName(control)
  }
  return <JGPercent {...props}></JGPercent>
}

export default JGPercent
export { convert, JGPercent, JsonJGPercent }
