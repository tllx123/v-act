import { Control } from '@v-act/schema-types'
import { toNumber, valueofHeight, valueofWidth } from '@v-act/widget-utils'
import JGTreeGrid, { JGTreeGridProps } from './JGTreeGrid'

export const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties
  const props: JGTreeGridProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: valueofWidth(pros.multiWidth, '200px'),
    height: valueofHeight(pros.multiHeight, '200px'),
    dataTreeHeader: pros.dataTreeHeader,
    data: pros.gridData
  }
  return <JGTreeGrid {...props}></JGTreeGrid>
}

export { JGTreeGrid }
