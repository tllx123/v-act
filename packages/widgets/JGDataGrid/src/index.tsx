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

import JGDataGrid, { JGDataGridProps } from './JGDataGrid'

const JsonJGDataGrid = function (props: {
  control: Control
  render: WidgetRenderer
  componentCode: string
  context: WidgetRenderContext
}) {
  return convert(props.control)
}

const convert = function (control: Control): JSX.Element {
  console.log(control.properties.labelText)
  console.log('control11111111111111111111')
  console.log(control)

  const pros = control.properties
  const props: JGDataGridProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: valueofWidth(pros.multiWidth, '200px'),
    height: valueofHeight(pros.multiHeight, '200px'),
    data: pros.gridData,
    dataHeader: pros.dataHeader,
    tablename: getTableName(control),
    columnname: getColumnName(control),
    control: control,
    rowHeight: toNumber(pros.rowHeight) + 'px',
    showRowNumbers: toBoolean(pros.showRowNumbers, false),
    chooseMode: pros.chooseMode,
    readonly: toBoolean(pros.readOnly, false),
    adaLineHeight: toBoolean(pros.adaLineHeight, false),
    allowMerge: toBoolean(pros.allowMerge, false),
    rowsFixedCount: toNumber(pros.rowsFixedCount)
    // showGridSummary：toBoolean(pros.showGridSummary, false)
  }
  return <JGDataGrid {...props}></JGDataGrid>
}

export { convert, JGDataGrid, JsonJGDataGrid }
