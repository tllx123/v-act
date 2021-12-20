import { Control, toNumber } from '@v-act/schema-types'

import { JGImageCutter, JGImageCutterProps } from './JGImageCutter'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties
  const props: JGImageCutterProps = {
    top: toNumber(pros.top),
    left: toNumber(pros.left)
  }
  console.log(123)
  return <JGImageCutter {...props}></JGImageCutter>
}

export default JGImageCutter
export { convert, JGImageCutter }
