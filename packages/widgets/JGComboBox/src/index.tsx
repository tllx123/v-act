import { Control } from '@v-act/schema-types'
import {
  getColumnName,
  getDropDownSource,
  getIDColumnName,
  getTableName,
  toBoolean,
  toNumber,
  valueofHeight,
  valueofWidth
} from '@v-act/widget-utils'

import { JGComboBox, JGComboBoxProps } from './JGComboBox'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  console.log('@@@@@@@@@@@@@@@:JGComboBox')
  console.log(control)
  const pros = control.properties
  const props: JGComboBoxProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    labelText: pros.labelText,
    placeholder: pros.placeholder,
    visible: toBoolean(pros.visible, true),
    labelWidth: toNumber(pros.labelWidth),
    labelVisible: toBoolean(pros.labelVisible, true),
    readOnly: toBoolean(pros.readOnly, false),
    enabled: toBoolean(pros.enabled, true),
    multiWidth: valueofWidth(pros.multiWidth, '235px'),
    multiHeight: valueofHeight(pros.multiHeight, '26px'),
    tableName: getTableName(control),
    columnName: getColumnName(control),
    idColumnName: getIDColumnName(control),
    dropDownSource: getDropDownSource(control)
  }

  /* 事件回调函数 */
  const events = control.events
  if (events && events.length > 0) {
    const eventMap: { [eventCode: string]: Function } = {}
    events.forEach((evt) => {
      eventMap[evt.code] = evt.handler
    })
    props.onValueChanged = eventMap.OnValueChanged
  }

  return <JGComboBox {...props}></JGComboBox>
}

export default JGComboBox
export { convert, JGComboBox }
