import { Control, toNumber } from '@v-act/schema-types'

import JGNewList, { JGNewListProps } from './JGNewList'

export const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties
  const props: JGNewListProps = {
    top: toNumber(pros.top) + '',
    left: toNumber(pros.left) + '',
    width: toNumber(pros.multiWidth) + '',
    height: toNumber(pros.multiHeight) + ''
  }
  return <JGNewList {...props}>{pros.labelText}</JGNewList>
}

export { JGNewList }
