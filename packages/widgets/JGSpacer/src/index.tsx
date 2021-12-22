import { Control } from '@v-act/schema-types'
import { toNumber, valueofHeight, valueofWidth } from '@v-act/widget-utils'

import { JGSpacer, JGSpacerProps } from './JGSpacer'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties
  const props: JGSpacerProps = {
    top: toNumber(pros.top, 0) + 'px',
    left: toNumber(pros.left, 0) + 'px',
    multiWidth: valueofWidth(pros.multiWidth, '235px'),
    multiHeight: valueofHeight(pros.multiHeight, '26px')
  }
  return <JGSpacer {...props}></JGSpacer>
}

export default JGSpacer

export { convert, JGSpacer }