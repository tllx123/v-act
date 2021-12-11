import { Control, toNumber } from '@v-act/schema-types'

import JGNewsList, { JGNewsListProps } from './JGNewList'

export const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties
  const props: JGNewsListProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: toNumber(pros.multiWidth) + 'px',
    height: toNumber(pros.multiHeight) + 'px'
  }
  return <JGNewsList {...props}>{pros.labelText}</JGNewsList>
}

export { JGNewsList }
