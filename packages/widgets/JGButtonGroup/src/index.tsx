import { Control } from '@v-act/schema-types'
import { JGButtonGroup, JGButtonGroupProps } from './JGButtonGroup'
import { toNumber, valueofWidth, valueofHeight } from '@v-act/widget-utils'
const convert = function (control: Control): JSX.Element {
  const pros = control.properties
  const props: JGButtonGroupProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: valueofWidth(pros.multiWidth, '235px'),
    height: valueofHeight(pros.multiHeight, '30px')
  }
  return <JGButtonGroup {...props}></JGButtonGroup>
}

export { convert, JGButtonGroup }