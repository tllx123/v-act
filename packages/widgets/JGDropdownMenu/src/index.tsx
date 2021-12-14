import { Control, toBoolean, toNumber } from '@v-act/schema-types'

import { JGDropdownMenu, JGDropdownMenuProps } from './JGDropdownMenu'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element
): JSX.Element {
  const pros = control.properties
  const props: JGDropdownMenuProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: toNumber(pros.multiWidth) + 'px',
    height: toNumber(pros.multiHeight) + 'px',
    visible: toBoolean(pros.visible, true)
  }
  return <JGDropdownMenu {...props}></JGDropdownMenu>
}

export default JGDropdownMenu

export { convert, JGDropdownMenu }
