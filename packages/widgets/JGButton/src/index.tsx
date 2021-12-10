import JGButton, { JGButtonProps } from './JGButton'
import { Control, toNumber, toBoolean } from '@v-act/schema-types'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
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

export { JGButton, convert }
