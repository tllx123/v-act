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
  const pros = control.properties
  const props: JGBaseDictBoxProps = {
    top: toNumber(pros.top),
    left: toNumber(pros.left),
    multiWidth: valueofWidth(pros.multiWidth, '235px'),
    multiHeight: valueofHeight(pros.multiHeight, '26px'),
    labelText: pros.labelText,
    isMust: toBoolean(pros.isMust),
    placeholder: pros.placeholder,
    // visible: toBoolean(pros.visible, true),
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
