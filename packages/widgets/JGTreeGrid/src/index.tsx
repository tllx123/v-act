import { Control, toBoolean, toNumber } from '@v-act/schema-types'

import JGTreeGrid, { JGTreeGridProps } from './JGTreeGrid'

export const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties
  const props: JGTreeGridProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: toNumber(pros.multiWidth) + 'px',
    height: toNumber(pros.multiHeight) + 'px',
    dataTreeHeader: pros.dataTreeHeader,
    data: pros.gridData
  }
  return <JGTreeGrid {...props}></JGTreeGrid>
}

export { JGTreeGrid }
