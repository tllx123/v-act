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

import { JGCheckBox, JGCheckBoxProps } from './JGCheckBox'

const JsonJGCheckBox = function (props: {
  control: Control
  render: WidgetRenderer
  componentCode: string
  context: WidgetRenderContext
}) {
  return convert(props.control)
}

const convert = function (control: Control): JSX.Element {
  const pros = control.properties

  const props: JGCheckBoxProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: valueofWidth(pros.multiWidth, '235px'),
    height: valueofHeight(pros.multiHeight, '26px'),
    ismust: toBoolean(pros.isMust, false),
    disabled: !toBoolean(pros.enabled, true),
    labelWidth: toNumber(pros.labelWidth, 94),
    placeholder: pros.placeholder,
    labeltext: pros.labelText,
    labelVisible: toBoolean(pros.labelVisible, true),
    readonly: toBoolean(pros.readOnly, false),
    tableName: getTableName(control),
    columnName: getColumnName(control)
  }
  return <JGCheckBox {...props}></JGCheckBox>
}

export { convert, JGCheckBox, JsonJGCheckBox }
