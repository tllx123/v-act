import { Control } from '@v-act/schema-types'
import { toNumber, valueofHeight, valueofWidth } from '@v-act/widget-utils'

import JGLabel, { JGLabelProps } from './JGLabel'

export const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties
  const props: JGLabelProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: valueofWidth(pros.multiWidth, '68px'),
    height: valueofHeight(pros.multiHeight, '24px')
  }
  return <JGLabel {...props}>{pros.labelText}</JGLabel>
}

export { JGLabel }
