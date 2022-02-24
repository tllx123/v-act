import {
  Control,
  WidgetRenderContext,
  WidgetRenderer
} from '@v-act/schema-types'
import {
  getColumnName,
  getTableName,
  toNumber,
  valueofHeight,
  valueofWidth
} from '@v-act/widget-utils'

import { JGCalendar, JGCalendarProps } from './JGCalendar'

const JsonJGCalendar = function (props: {
  control: Control
  render: WidgetRenderer
  componentCode: string
  context: WidgetRenderContext
}) {
  return convert(props.control, props.render)
}

const convert = function (
  control: Control,
  render: WidgetRenderer
): JSX.Element {
  // console.log(control,"11111111111111111")
  const pros = control.properties
  const props: JGCalendarProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    multiWidth: valueofWidth(pros.multiWidth, '235px'),
    multiHeight: valueofHeight(pros.multiHeight, '26px'),
    tableName: getTableName(control),
    columnName: getColumnName(control)
  }
  const events = control.events
  if (events && events.length > 0) {
    const eventMap: { [eventCode: string]: Function } = {}
    events.forEach((evt) => {
      eventMap[evt.code] = evt.handler
    })
    props.click = eventMap.OnDateClick
  }
  return <JGCalendar {...props}></JGCalendar>
}
export default JGCalendar

export { convert, JGCalendar, JsonJGCalendar }
