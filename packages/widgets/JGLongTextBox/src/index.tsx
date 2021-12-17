import { Control, toBoolean, toNumber } from '@v-act/schema-types'

import JGLongTextBox, { JGLongTextBoxProps } from './JGLongTextBox'

export const convert = function (control: Control): JSX.Element {
  const pros = control.properties
  const props: JGLongTextBoxProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: toNumber(pros.multiWidth) + 'px',
    height: toNumber(pros.multiHeight) + 'px',
    ismust: toBoolean(pros.isMust, false),
    placeholder: pros.placeholder,
    disabled: !toBoolean(pros.enabled, true)
  }
  return <JGLongTextBox {...props}></JGLongTextBox>
}

export { JGLongTextBox }
