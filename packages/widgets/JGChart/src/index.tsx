import { Control } from '@v-act/schema-types'
import {
  getTableName,
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
  console.log('@@@@@@@@@@@@@@@:JGChart')
  const pros = control.properties
  const props: JGChartProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    visible: toBoolean(pros.visible, true),
    multiWidth: valueofWidth(pros.multiWidth, '462px'),
    multiHeight: valueofHeight(pros.multiHeight, '213px'),
    tableName: getTableName(control),
    graphSettings: pros.graphSettings,
    code: pros.code,
    alias: pros.alias,
    tabIndex: toNumber(pros.tabIndex)
  }
  return <JGChart {...props}></JGChart>
}

export default JGChart
export { convert, JGChart }
