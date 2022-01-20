import { Control, IPrototypeLoginProperty } from '@v-act/schema-types'
import { getComponentResPath } from '@v-act/widget-utils'

import { IPrototypeLogin, IPrototypeLoginProps } from './IPrototypeLogin'

export const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null,
  componentCode: string
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

export { IPrototypeLogin, type IPrototypeLoginProps }
