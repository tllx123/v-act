import { Control, toBoolean, toNumber } from '@v-act/schema-types'

import { JGChart, JGChartProps } from './JGChart'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties
  const props: JGChartProps = {
    top: toNumber(pros.top),
    left: toNumber(pros.left),
    placeholder: pros.placeholder,
    visible: toBoolean(pros.visible, true)
  }
  console.log(123)
  return <JGChart {...props}></JGChart>
}

export default JGChart
export { convert, JGChart }
