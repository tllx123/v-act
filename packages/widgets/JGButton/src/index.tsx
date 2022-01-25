import { Control } from '@v-act/schema-types'
import {
  getComponentResPath,
  toBoolean,
  toNumber,
  valueofHeight,
  valueofTheme,
  valueofWidth
} from '@v-act/widget-utils'

import JGButton, { JGButtonProps } from './JGButton'

export const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null,
  componentCode: string
): JSX.Element {
  console.log('===========================', 'control')
  console.log(control)
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

export { JGButton }
