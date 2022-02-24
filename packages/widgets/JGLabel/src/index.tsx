import {
  Control,
  WidgetRenderContext,
  WidgetRenderer
} from '@v-act/schema-types'
import { toNumber, valueofHeight, valueofWidth } from '@v-act/widget-utils'

import JGLabel, { JGLabelProps } from './JGLabel'

const JsonJGLabel = function (props: {
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
  const pros = control.properties
  const props: JGLabelProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: valueofWidth(pros.multiWidth, '68px'),
    height: valueofHeight(pros.multiHeight, '24px'),
    fontStyle: pros.fontStyle,
    textAlign: pros.textAlign,
    foreColor: pros.foreColor
  }
  const events = control.events
  if (events && events.length > 0) {
    const eventMap: { [eventCode: string]: Function } = {}
    events.forEach((evt) => {
      eventMap[evt.code] = evt.handler
    })
    props.click = eventMap.OnClick
  }
  return <JGLabel {...props}>{pros.labelText}</JGLabel>
}

export { JGLabel, JsonJGLabel }
