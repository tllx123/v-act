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

import { JGTextBox, JGTextBoxProps } from './JGTextBox'

const convert = function (
  control: Control,
  render: WidgetRenderer,
  componentCode: string,
  context: WidgetRenderContext
): JSX.Element {
  const pros = control.properties
  const props: JGTextBoxProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    multiWidth: valueofWidth(pros.multiWidth, '235px'),
    multiHeight: valueofHeight(pros.multiHeight, '26px'),
    labelText: pros.labelText || '文本',
    isMust: toBoolean(pros.isMust, false),
    placeholder: pros.placeholder,
    visible: toBoolean(pros.visible, true),
    labelWidth: toNumber(pros.labelWidth),
    labelVisible: toBoolean(pros.labelVisible, true),
    disabled: !toBoolean(pros.enabled, true),
    tableName: getTableName(control),
    columnName: getColumnName(control)
  }
  return <JGTextBox {...props}></JGTextBox>
}

const JsonJGTextBox = function (props: {
  control: Control
  render: WidgetRenderer
  componentCode: string
  context: WidgetRenderContext
}) {
  return convert(
    props.control,
    props.render,
    props.componentCode,
    props.context
  )
}

export default JGTextBox

export { convert, JGTextBox, JsonJGTextBox }
