import { Control } from '@v-act/schema-types'
import {
  getColumnName,
  getTableName,
  toBoolean,
  toNumber,
  valueofHeight,
  valueofWidth
} from '@v-act/widget-utils'

import { JGHyperLink, JGHyperLinkProps } from './JGHyperLink'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  // console.log(control,"sssssssssssssssssssss")
  const pros = control.properties
  const props: JGHyperLinkProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    multiWidth: valueofWidth(pros.multiWidth, '235px'),
    multiHeight: valueofHeight(pros.multiHeight, '26px'),
    labelText: pros.labelText,
    labelWidth: toNumber(pros.labelWidth),
    labelVisible: toBoolean(pros.labelVisible, true),
    enabled: toBoolean(pros.enabled, true),
    tableName: getTableName(control),
    columnName: getColumnName(control),
    placeholder: pros.placeholder
  }
  const events = control.events
  if (events && events.length > 0) {
    const eventMap: { [eventCode: string]: Function } = {}
    events.forEach((evt) => {
      eventMap[evt.code] = evt.handler
    })
    props.click = eventMap.OnClick
  }
  return <JGHyperLink {...props}></JGHyperLink>
}

export default JGHyperLink

export { convert, JGHyperLink }
