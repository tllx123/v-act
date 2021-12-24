import { Control, toBoolean, toNumber } from '@v-act/schema-types'

import {
  JGComponentContainer,
  JGComponentContainerProps
} from './JGComponentContainer'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties

  const props: JGComponentContainerProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: toNumber(pros.multiWidth) + 'px',
    height: toNumber(pros.multiHeight) + 'px',
    bodercolor: pros.boderColor,
    visible: toBoolean(pros.visible, true)
  }
  return <JGComponentContainer {...props}></JGComponentContainer>
}

export { convert, JGComponentContainer }
