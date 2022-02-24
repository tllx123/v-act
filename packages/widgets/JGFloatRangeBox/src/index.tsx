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

import { JGFloatBoxProps, JGFloatRangeBox } from './JGFloatRangeBox'

const JsonJGFloatRangeBox = function (props: {
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
  const props: JGFloatBoxProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: valueofWidth(pros.multiWidth || pros.width, '235px'),
    height: valueofHeight(pros.multiHeight || pros.height, '26px'),
    labelText: pros.labelText || '文本',
    isMust: toBoolean(pros.isMust),
    placeholder: pros.placeholder,
    visible: toBoolean(pros.visible, true),
    labelWidth: toNumber(pros.labelWidth),
    labelVisible: toBoolean(pros.labelVisible, true),
    multiWidth: valueofWidth(pros.multiWidth || pros.width, '235px'),
    multiHeight: valueofHeight(pros.multiHeight || pros.height, '26px'),
    disabled: !toBoolean(pros.enabled, true),
    tableName: getTableName(control),
    columnName: getColumnName(control)
  }
  return <JGFloatRangeBox {...props}></JGFloatRangeBox>
}

export default JGFloatRangeBox

export { convert, JGFloatRangeBox, JsonJGFloatRangeBox }
