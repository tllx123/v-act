import { Control, toNumber, toBoolean } from '@v-act/schema-types'
import { JGAttachment, JGAttachmentProps } from './JGAttachment'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element
): JSX.Element {
  const pros = control.properties
  const props: JGAttachmentProps = {
    top: toNumber(pros.top),
    left: toNumber(pros.left),
    labelText: pros.labelText,
    isMust: toBoolean(pros.isMust),
    placeholder: pros.placeholder,
    visible: toBoolean(pros.visible),
    labelWidth: toNumber(pros.labelWidth),
    labelVisible: toBoolean(pros.labelVisible, true)
  }
  return <JGAttachment {...props}></JGAttachment>
}

export default JGAttachment

export { JGAttachment, convert }
