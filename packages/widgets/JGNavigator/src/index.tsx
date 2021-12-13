import { Control, toBoolean, toNumber } from '@v-act/schema-types'

import { JGNavigator, JGNavigatorProps } from './JGNavigator'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element
): JSX.Element {
  const pros = control.properties
  const props: JGNavigatorProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: toNumber(pros.multiWidth) + 'px',
    height: toNumber(pros.multiHeight) + 'px',
    placeholder: pros.placeholder,
    visible: toBoolean(pros.visible, true),
    children: pros.children
  }
  return <JGNavigator {...props}></JGNavigator>
}

export default JGNavigator

export { convert, JGNavigator }
