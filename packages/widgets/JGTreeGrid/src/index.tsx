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

import JGTreeGrid, { JGTreeGridProps } from './JGTreeGrid'

const JsonJGTreeGrid = function (props: {
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
  const props: JGTreeGridProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: valueofWidth(pros.multiWidth, '200px'),
    height: valueofHeight(pros.multiHeight, '200px'),
    data: pros.gridData,
    tablename: getTableName(control),
    columnname: getColumnName(control),
    labelText: pros.labelText,
    control: control,
    readonly: toBoolean(pros.readOnly, false),
    adaLineHeight: toBoolean(pros.adaLineHeight, false),
    cascadeCheck: toBoolean(pros.cascadeCheck, false),
    showRowNumbers: toBoolean(pros.showRowNumbers, false),
    allowMerge: toBoolean(pros.allowMerge, false),
    rowsFixedCount: toNumber(pros.rowsFixedCount),
    chooseMode: pros.chooseMode
  }
  return <JGTreeGrid {...props}></JGTreeGrid>
}

export { JGTreeGrid, JsonJGTreeGrid, convert }
