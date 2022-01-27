import { Control } from '@v-act/schema-types'
import {
  toNumber,
  valueofHeight,
  valueofWidth,
  getColumnName,
  getTableName,
  toBoolean
} from '@v-act/widget-utils'
import JGTreeGrid, { JGTreeGridProps } from './JGTreeGrid'

export const convert = function (control: Control): JSX.Element {
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
    showRowNumbers: toBoolean(pros.showRowNumbers, true),
    allowMerge: toBoolean(pros.allowMerge, false),
    rowsFixedCount: toNumber(pros.rowsFixedCount)
  }
  return <JGTreeGrid {...props}></JGTreeGrid>
}

export { JGTreeGrid }
