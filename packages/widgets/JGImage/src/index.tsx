import {
  Control,
  JGImageProperty,
  WidgetRenderContext,
  WidgetRenderer
} from '@v-act/schema-types'
import { getComponentResPath, toNumber } from '@v-act/widget-utils'

import JGImage, { JGImageProps } from './JGImage'

const JsonJGImage = function (props: {
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
  const pros: JGImageProperty = control.properties
  const props: JGImageProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: toNumber(pros.multiWidth) + 'px',
    height: toNumber(pros.height || pros.multiHeight) + 'px',
    imagePosition: pros.imagePosition,
    image: pros.imageValue
      ? getComponentResPath(pros.imageValue, componentCode)
      : undefined
  }
  const events = control.events
  if (events && events.length > 0) {
    const eventMap: { [eventCode: string]: Function } = {}
    events.forEach((evt) => {
      eventMap[evt.code] = evt.handler
    })
    props.click = eventMap.OnClick
  }
  return <JGImage {...props}>{pros.labelText}</JGImage>
}

export { JGImage, JsonJGImage }
