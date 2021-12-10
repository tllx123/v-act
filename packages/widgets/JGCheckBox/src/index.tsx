import { JGCheckBox, JGCheckBoxProps } from './JGCheckBox'
import { Control, toNumber, toBoolean } from '@v-act/schema-types'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties
  const props: JGCheckBoxProps = {
    left: pros.left,
    top: pros.top,
    height: pros.height,
    width: pros.width,
    position: pros.position,
    margin: pros.margin,
    padding: pros.padding,
    labeltext: pros.labeltext,
    readonly: toBoolean(pros.readonly, false),
    ismust: toBoolean(pros.isMust, false),
    disabled: !toBoolean(pros.enabled, true)
  }
  return <JGCheckBox {...props}></JGCheckBox>
}

export { JGCheckBox, convert }
