import { Control, toBoolean, toNumber } from '@v-act/schema-types'

import { JGStartMenu, JGStartMenuProps } from './JGStartMenu'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element
): JSX.Element {
  const pros = control.properties
  const props: JGStartMenuProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: toNumber(pros.multiWidth) + 'px',
    height: toNumber(pros.multiHeight) + 'px',
    visible: toBoolean(pros.visible, true)
  }
  return <JGStartMenu {...props}></JGStartMenu>
}

export default JGStartMenu

export { convert, JGStartMenu }
