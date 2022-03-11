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

import { JGRadioGroup, JGRadioGroupProps } from './JGRadioGroup'

const JsonJGRadioGroup = function (props: {
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
  console.log('@@@@@@@@@@@@@@@:JGRadioGroup')
  const pros = control.properties
  const props: JGRadioGroupProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    labelText: pros.labelText,
    visible: toBoolean(pros.visible, true),
    isMust: toBoolean(pros.isMust, false),
    readOnly: toBoolean(pros.readOnly, false),
    enabled: toBoolean(pros.enabled, true),
    labelWidth: toNumber(pros.labelWidth),
    labelVisible: toBoolean(pros.labelVisible, true),
    multiWidth: valueofWidth(pros.multiWidth, '235px'),
    multiHeight: valueofHeight(pros.multiHeight, '26px'),
    tableName: getTableName(control),
    columnName: getColumnName(control),
    idColumnName: getIDColumnName(control),
    dropDownSource: getDropDownSource(control)
  }
  return <JGRadioGroup {...props}></JGRadioGroup>
}

export default JGRadioGroup
export { convert, JGRadioGroup, JsonJGRadioGroup }
