import {
  Control,
  IPrototypeLoginProperty,
  WidgetRenderContext,
  WidgetRenderer
} from '@v-act/schema-types'
import { getComponentResPath } from '@v-act/widget-utils'

import { IPrototypeLogin, IPrototypeLoginProps } from './IPrototypeLogin'

const convert = function (
  control: Control,
  render: WidgetRenderer,
  componentCode: string,
  context: WidgetRenderContext
): JSX.Element {
  const pros: IPrototypeLoginProperty = control.properties
  const props: IPrototypeLoginProps = {
    backgroundPic: pros.backgroundPic
      ? getComponentResPath(pros.backgroundPic, componentCode)
      : undefined,
    logoPic: pros.logoPic
      ? getComponentResPath(pros.logoPic, componentCode)
      : undefined
  }
  const events = control.events
  if (events && events.length > 0) {
    const eventMap: { [eventCode: string]: Function } = {}
    events.forEach((evt) => {
      eventMap[evt.code] = evt.handler
    })
    props.onlogin = eventMap.OnLogin
  }
  return <IPrototypeLogin {...props}></IPrototypeLogin>
}

const JsonIPrototypeLogin = function (props: {
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

export { IPrototypeLogin, type IPrototypeLoginProps, JsonIPrototypeLogin }
