import { Control, toNumber } from '@v-act/schema-types'

import JGRecordPaging, { JGRecordPagingProps } from './JGRecordPaging'

export const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties
  const props: JGRecordPagingProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: toNumber(pros.multiWidth) + 'px',
    height: toNumber(pros.multiHeight) + 'px'
  }
  return <JGRecordPaging {...props} />
}

export { JGRecordPaging }
