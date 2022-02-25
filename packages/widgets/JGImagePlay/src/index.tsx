import {
  Control,
  WidgetRenderContext,
  WidgetRenderer
} from '@v-act/schema-types'
import {
  getTableName,
  toBoolean,
  toNumber,
  valueofHeight,
  valueofWidth
} from '@v-act/widget-utils'

import { JGImagePlay, JGImagePlayProps } from './JGImagePlay'

const JsonJGImagePlay = function (props: {
  control: Control
  render: WidgetRenderer
  componentCode: string
  context: WidgetRenderContext
}) {
  return convert(props.control, props.render, props.componentCode)
}

const convert = function (
  control: Control,
  render: WidgetRenderer,
  componentCode: string
): JSX.Element {
  // console.log(control, componentCode, 'JGImagePlay======control')
  const pros = control.properties
  const props: JGImagePlayProps = {
    alias: pros.alias,
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    multiWidth: valueofWidth(pros.multiWidth, '235px'),
    multiHeight: valueofHeight(pros.multiHeight, '26px'),
    tableName: getTableName(control),
    componentCode: componentCode, //构件编码
    imageLayout: pros.imageLayout,
    paginationVisible: toBoolean(pros.paginationVisible, true), //显示页码
    swiInterval: toNumber(pros.swiInterval, 5) //轮播时间
  }

  //点击事件
  const events = control.events
  if (events && events.length > 0) {
    const eventMap: { [eventCode: string]: Function } = {}
    events.forEach((evt) => {
      eventMap[evt.code] = evt.handler
    })
    props.click = eventMap.OnClick
  }
  return <JGImagePlay {...props}></JGImagePlay>
}

export default JGImagePlay

export { convert, JGImagePlay, JsonJGImagePlay }
