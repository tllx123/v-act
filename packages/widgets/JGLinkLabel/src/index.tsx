import {
  Control,
  WidgetRenderContext,
  WidgetRenderer
} from '@v-act/schema-types'
import {
  toBoolean,
  toNumber,
  valueofHeight,
  valueofWidth
} from '@v-act/widget-utils'

import { JGLinkLabel, JGLinkLabelProps } from './JGLinkLabel'

const JsonJGLinkLabel = function (props: {
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
  console.log(control)
  const pros = control.properties
  const props: JGLinkLabelProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: valueofWidth(pros.multiWidth, '68px'),
    height: valueofHeight(pros.multiHeight, '24px'),
    multiWidth: valueofWidth(pros.multiWidth, '68px'),
    multiHeight: valueofHeight(pros.multiHeight, '24px'),
    labelText: pros.labelText,
    visible: toBoolean(pros.visible, true),
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
  return <JGLinkLabel {...props}></JGLinkLabel>
}

export default JGLinkLabel

export { convert, JGLinkLabel, JsonJGLinkLabel }
