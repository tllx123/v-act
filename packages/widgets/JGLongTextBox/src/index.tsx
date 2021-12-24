import { Control } from '@v-act/schema-types'
import { toBoolean, toNumber } from '@v-act/widget-utils'

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
    disabled: !toBoolean(pros.enabled, true),
    labeltext: pros.labelText || '',
    labelWidth: toNumber(pros.labelWidth, 94),
    labelVisible: toBoolean(pros.labelVisible, true)
  }
  return <JGLongTextBox {...props}></JGLongTextBox>
}

export { JGLongTextBox }
