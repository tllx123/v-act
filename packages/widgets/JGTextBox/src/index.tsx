import { Control } from '@v-act/schema-types'
import JGTextBox from './JGTextBox'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => string
): string {
  return ''
}

export default JGTextBox

export { JGTextBox, convert }
