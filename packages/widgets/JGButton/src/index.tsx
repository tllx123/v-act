import { Control, toBoolean, toNumber } from '@v-act/schema-types'

import JGButton, { JGButtonProps } from './JGButton'

export const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties
  const props: JGButtonProps = {
    top: toNumber(pros.top) + '',
    left: toNumber(pros.left) + '',
    width: toNumber(pros.multiWidth) + '',
    height: toNumber(pros.multiHeight) + '',
    disabled: !toBoolean(pros.enabled, true)
  }
  return <JGButton {...props}>{pros.labelText}</JGButton>
}

export { JGButton }
