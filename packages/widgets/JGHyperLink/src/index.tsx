import { Control, toNumber, toBoolean } from '@v-act/schema-types'
import { JGHyperLink, JGHyperLinkProps } from './JGHyperLink'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties
  const props: JGHyperLinkProps = {
    top: toNumber(pros.top),
    left: toNumber(pros.left),
    labelText: pros.labelText,
    isMust: toBoolean(pros.isMust, false),
    placeholder: pros.placeholder,
    visible: toBoolean(pros.visible, true),
    labelWidth: toNumber(pros.labelWidth),
    labelVisible: toBoolean(pros.labelVisible, true),
    disabled: !toBoolean(pros.enabled, true)
  }
  return <JGHyperLink {...props}></JGHyperLink>
}

export default JGHyperLink

export { JGHyperLink, convert }
