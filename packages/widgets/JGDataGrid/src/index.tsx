import { Control } from '@v-act/schema-types'

import JGDataGrid, { JGDataGridProps } from './JGDataGrid'
import {
  toNumber,
  valueofHeight,
  valueofWidth,
  getColumnName,
  getTableName,
  toBoolean
} from '@v-act/widget-utils'
const convert = function (control: Control): JSX.Element {
  console.log(control.properties.labelText)
  console.log('control')
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
    showRowNumbers: toBoolean(pros.showRowNumbers, true),
    chooseMode: pros.chooseMode,
    readonly: toBoolean(pros.readOnly, false),
    adaLineHeight: toBoolean(pros.adaLineHeight, false),
    allowMerge: toBoolean(pros.allowMerge, false),
    rowsFixedCount: toNumber(pros.rowsFixedCount)
  }
  return <JGDataGrid {...props}></JGDataGrid>
}

export { convert, JGDataGrid }
