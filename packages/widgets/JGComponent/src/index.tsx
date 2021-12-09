import { Control, toNumber, toBoolean } from '@v-act/schema-types'
import { JGComponent, JGComponentProps } from './JGComponent'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties
  const props: JGComponentProps = {
    top: toNumber(pros.top),
    left: toNumber(pros.left)
  }
  return <JGComponent key={pros.code}>{render(control.controls)}</JGComponent>
}

export { JGComponent, convert }
