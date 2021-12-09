import JGButton, { JGButtonProps } from './JGButton'
import { Control, toNumber, toBoolean } from '@v-act/schema-types'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element
): JSX.Element {
  const pros = control.properties
  const props: JGButtonProps = {
    top: toNumber(pros.top),
    left: toNumber(pros.left),
    disabled: !toBoolean(pros.enabled, true)
  }
  return <JGButton {...props}>{pros.lableText}</JGButton>
}

export { JGButton, convert }
