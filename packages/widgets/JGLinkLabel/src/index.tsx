import { Control, toBoolean, toNumber } from '@v-act/schema-types'

import { JGLinkLabel, JGLinkLabelProps } from './JGLinkLabel'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element
): JSX.Element {
  const pros = control.properties
  const props: JGLinkLabelProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: toNumber(pros.multiWidth) + 'px',
    height: toNumber(pros.multiHeight) + 'px',
    labelText: pros.labelText,
    isMust: toBoolean(pros.isMust),
    placeholder: pros.placeholder,
    visible: toBoolean(pros.visible, true),
    labelWidth: toNumber(pros.labelWidth),
    labelVisible: toBoolean(pros.labelVisible, true)
  }
  return <JGLinkLabel {...props}></JGLinkLabel>
}

export default JGLinkLabel

export { convert, JGLinkLabel }
