import { Control } from '@v-act/schema-types'
import {
  toBoolean,
  toNumber,
  valueofHeight,
  valueofWidth
} from '@v-act/widget-utils'

import JGButton, { JGButtonProps } from './JGButton'

export const convert = function (control: Control): JSX.Element {
  const pros = control.properties
  const props: JGButtonProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: valueofWidth(pros.multiWidth, '59px'),
    height: valueofHeight(pros.multiHeight, '26px'),
    disabled: !toBoolean(pros.enabled, true)
  }
  return <JGButton {...props}>{pros.labelText}</JGButton>
}

export { JGButton }
