import { Control, toNumber } from '@v-act/schema-types'

import { JGDiv, JGDivProps } from './JGDiv'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties
  const props: JGDivProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: toNumber(pros.multiWidth) + 'px',
    height: toNumber(pros.multiHeight) + 'px'
  }
  return <JGDiv {...props}></JGDiv>
}

export default JGDiv

export { convert, JGDiv }
