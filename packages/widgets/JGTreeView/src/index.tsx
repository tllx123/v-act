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

import JGTreeView, { JGTreeViewProps } from './JGTreeView'

const JsonJGTreeView = function (props: {
  control: Control
  render: WidgetRenderer
  componentCode: string
  context: WidgetRenderContext
}) {
  return convert(props.control)
}

const convert = function (control: Control): JSX.Element {
  // console.log(control.properties.labelText)
  // console.log('control')
  // console.log(control)

  const pros = control.properties
  const props: JGTreeViewProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: valueofWidth(pros.multiWidth, '200px'),
    height: valueofHeight(pros.multiHeight, '200px'),
    disable: !toBoolean(pros.enabled, true),
    readonly: toBoolean(pros.readOnly, false),
    tablename: getTableName(control),
    columnname: getColumnName(control),
    labelText: pros.labelText,
    control: control,
    cascadeCheck: toBoolean(pros.cascadeCheck, false),
    displayMode: pros.displayMode
  }
  return <JGTreeView {...props}></JGTreeView>
}

export { convert, JGTreeView, JsonJGTreeView }
