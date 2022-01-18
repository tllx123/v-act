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

  /* 事件回调函数 */
  const events = control.events
  if (events && events.length > 0) {
    const eventMap: { [eventCode: string]: Function } = {}
    events.forEach((evt) => {
      eventMap[evt.code] = evt.handler
    })
    props.onChartClick = eventMap.OnChartClick
  }
  return <JGChart {...props}></JGChart>
}

export default JGChart
export { convert, JGChart }
