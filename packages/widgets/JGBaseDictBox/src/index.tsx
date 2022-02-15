import { Control } from '@v-act/schema-types'
import {
  toBoolean,
  toNumber,
  valueofHeight,
  valueofWidth
} from '@v-act/widget-utils'

import { JGBaseDictBox, JGBaseDictBoxProps } from './JGBaseDictBox'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element
): JSX.Element {
  // console.log(control.properties,"aaaaaa")
  const pros = control.properties
  const props: JGBaseDictBoxProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    multiWidth: valueofWidth(pros.multiWidth, '300px'),
    multiHeight: valueofHeight(pros.multiHeight, '26px'),
    labelText: pros.labelText,
    isMust: toBoolean(pros.isMust),
    placeholder: pros.placeholder,
    enabled: toBoolean(pros.enabled, true),
    readOnly: toBoolean(pros.readOnly, false),
    labelWidth: toNumber(pros.labelWidth)
  }
  const events = control.events
  if (events && events.length > 0) {
    const eventMap: { [eventCode: string]: Function } = {}
    events.forEach((evt) => {
      eventMap[evt.code] = evt.handler
    })
    props.click = eventMap.OpenModuleAction
  }
  return <JGBaseDictBox {...props}></JGBaseDictBox>
}

export default JGBaseDictBox

export { convert, JGBaseDictBox }
