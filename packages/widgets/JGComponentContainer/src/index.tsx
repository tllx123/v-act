import { Control } from '@v-act/schema-types'
import {
  toBoolean,
  toNumber,
  valueofWidth,
  valueofHeight
} from '@v-act/widget-utils'
import JGComponentContainer, {
  JGComponentContainerProps
} from './JGComponentContainer'

const convert = function (control: Control): JSX.Element {
  const pros = control.properties

  const props: JGComponentContainerProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: valueofWidth(pros.multiWidth, '235px'),
    height: valueofHeight(pros.multiHeight, '26px'),
    bodercolor: pros.boderColor,
    visible: toBoolean(pros.visible, true)
  }
  return <JGComponentContainer {...props}></JGComponentContainer>
}

export { convert, JGComponentContainer }
