import { Control, toBoolean, toNumber } from '@v-act/schema-types'

import JGDataGrid, { JGDataGridProps } from './JGDataGrid'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties
  const props: JGDataGridProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: toNumber(pros.multiWidth) + 'px',
    height: toNumber(pros.multiHeight) + 'px',
    data: pros.gridData,
    dataHeader: pros.dataHeader
  }
  return <JGDataGrid {...props}></JGDataGrid>
}

export { convert, JGDataGrid }
