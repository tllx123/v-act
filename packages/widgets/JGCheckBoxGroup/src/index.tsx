import {
  Control,
  WidgetRenderContext,
  WidgetRenderer
} from '@v-act/schema-types'
import {
  getColumnName,
  getDropDownSource,
  getIDColumnName,
  getTableName,
  toBoolean,
  toNumber,
  valueofHeight,
  valueofWidth
} from '@v-act/widget-utils'

import { JGCheckBoxGroup, JGCheckBoxGroupProps } from './JGCheckBoxGroup'

const JsonJGCheckBoxGroup = function (props: {
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
  const pros = control.properties
  const props: JGCheckBoxGroupProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    labelText: pros.labelText,
    placeholder: pros.placeholder,
    visible: toBoolean(pros.visible, true),
    isMust: toBoolean(pros.isMust, false),
    labelWidth: toNumber(pros.labelWidth),
    labelVisible: toBoolean(pros.labelVisible, true),
    readOnly: toBoolean(pros.readOnly, false),
    enabled: toBoolean(pros.enabled, true),
    multiWidth: valueofWidth(pros.multiWidth, '235px'),
    multiHeight: valueofHeight(pros.multiHeight, '26px'),
    tableName: getTableName(control),
    columnName: getColumnName(control),
    idColumnName: getIDColumnName(control),
    dropDownSource: getDropDownSource(control)
  }
  return <JGCheckBoxGroup {...props}></JGCheckBoxGroup>
}

export default JGCheckBoxGroup
export { convert, JGCheckBoxGroup, JsonJGCheckBoxGroup }
