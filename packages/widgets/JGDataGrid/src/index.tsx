import { Control } from '@v-act/schema-types'

import JGDataGrid, { JGDataGridProps } from './JGDataGrid'
import { toNumber, valueofHeight, valueofWidth } from '@v-act/widget-utils'
const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties
  const props: JGDataGridProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: valueofWidth(pros.multiWidth, '200px'),
    height: valueofHeight(pros.multiHeight, '200px'),
    data: pros.gridData,
    dataHeader: pros.dataHeader
  }
  return <JGDataGrid {...props}></JGDataGrid>
}

export { convert, JGDataGrid }
