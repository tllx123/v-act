import {
  Control,
  WidgetRenderContext,
  WidgetRenderer
} from '@v-act/schema-types'
import {
  getComponentResPath,
  toBoolean,
  toNumber,
  valueofHeight,
  valueofTheme,
  valueofWidth
} from '@v-act/widget-utils'

import JGButton, { JGButtonProps } from './JGButton'

const convert = function (
  control: Control,
  render: WidgetRenderer,
  componentCode: string,
  context: WidgetRenderContext
): JSX.Element {
  const pros = control.properties
  const props: JGButtonProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: valueofWidth(pros.multiWidth, '59px'),
    height: valueofHeight(pros.multiHeight, '26px'),
    disabled: !toBoolean(pros.enabled, true),
    backColor: valueofTheme(pros.theme, control).backgroundColor,
    imageValue: pros.imageValue
      ? getComponentResPath(pros.imageValue, componentCode)
      : ''
  }
  const events = control.events
  if (events && events.length > 0) {
    const eventMap: { [eventCode: string]: Function } = {}
    events.forEach((evt) => {
      eventMap[evt.code] = evt.handler
    })
    props.click = eventMap.OnClick
  }
  return <JGButton {...props}>{pros.labelText}</JGButton>
}

const JsonJGButton = function (props: {
  control: Control
  render: WidgetRenderer
  componentCode: string
  context: WidgetRenderContext
}) {
  return convert(
    props.control,
    props.render,
    props.componentCode,
    props.context
  )
}

export { JGButton, JsonJGButton }
