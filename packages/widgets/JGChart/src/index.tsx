import { Control } from '@v-act/schema-types'
import {
  toBoolean,
  toNumber,
  valueofHeight,
  valueofWidth
} from '@v-act/widget-utils'

import { JGChart, JGChartProps } from './JGChart'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties
  const props: JGChartProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    visible: toBoolean(pros.visible, true),
    multiWidth: valueofWidth(pros.multiWidth, '462px'),
    multiHeight: valueofHeight(pros.multiHeight, '213px')
  }
  console.log(123)
  return <JGChart {...props}></JGChart>
}

export default JGChart
export { convert, JGChart }
