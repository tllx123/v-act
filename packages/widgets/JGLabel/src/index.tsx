import { Control, toNumber } from '@v-act/schema-types'

import JGLabel, { JGLabelProps } from './JGLabel'

export const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties
  const props: JGLabelProps = {
    top: toNumber(pros.top) + '',
    left: toNumber(pros.left) + '',
    width: toNumber(pros.multiWidth) + '',
    height: toNumber(pros.multiHeight) + ''
  }
  return <JGLabel {...props}>{pros.labelText}</JGLabel>
}

export { JGLabel }
