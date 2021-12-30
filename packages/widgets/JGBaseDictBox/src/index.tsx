import { Control } from '@v-act/schema-types'
import { toBoolean, toNumber } from '@v-act/widget-utils'

import { JGBaseDictBox, JGBaseDictBoxProps } from './JGBaseDictBox'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element
): JSX.Element {
  const pros = control.properties
  const props: JGBaseDictBoxProps = {
    top: toNumber(pros.top),
    left: toNumber(pros.left),
    labelText: pros.labelText,
    isMust: toBoolean(pros.isMust),
    placeholder: pros.placeholder,
    visible: toBoolean(pros.visible, true),
    labelWidth: toNumber(pros.labelWidth),
    labelVisible: toBoolean(pros.labelVisible, true)
  }
  return <JGBaseDictBox {...props}></JGBaseDictBox>
}

export default JGBaseDictBox

export { convert, JGBaseDictBox }
