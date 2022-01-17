import { Control } from '@v-act/schema-types'
import {
  toBoolean,
  toNumber,
  valueofHeight,
  valueofWidth
} from '@v-act/widget-utils'

import { JGLinkLabel, JGLinkLabelProps } from './JGLinkLabel'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element
): JSX.Element {
  console.log(control)
  const pros = control.properties
  const props: JGLinkLabelProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: valueofWidth(pros.multiWidth, '68px'),
    height: valueofHeight(pros.multiHeight, '24px'),
    multiWidth: valueofWidth(pros.multiWidth, '68px'),
    multiHeight: valueofHeight(pros.multiHeight, '24px'),
    labelText: pros.labelText,
    visible: toBoolean(pros.visible, true),
    textAlign: pros.textAlign,
    foreColor: pros.foreColor
  }
  return <JGLinkLabel {...props}></JGLinkLabel>
}

export default JGLinkLabel

export { convert, JGLinkLabel }
