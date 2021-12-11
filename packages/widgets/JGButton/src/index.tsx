import { Control, toBoolean, toNumber } from '@v-act/schema-types'

import JGButton, { JGButtonProps } from './JGButton'

export const convert = function (control: Control): JSX.Element {
  const pros = control.properties
  const props: JGButtonProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: toNumber(pros.multiWidth) + 'px',
    height: toNumber(pros.multiHeight) + 'px',
    disabled: !toBoolean(pros.enabled, true)
  }
  return <JGButton {...props}>{pros.labelText}</JGButton>
}

export { JGButton }
