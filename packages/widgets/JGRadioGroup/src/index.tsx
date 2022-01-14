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

import { JGRadioGroup, JGRadioGroupProps } from './JGRadioGroup'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  console.log('@@@@@@@@@@@@@@@:JGRadioGroup')
  console.log(control)
  const pros = control.properties
  const props: JGRadioGroupProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    labelText: pros.labelText,
    visible: toBoolean(pros.visible, true),
    isMust: toBoolean(pros.isMust, false),
    readOnly: toBoolean(pros.readOnly, false),
    enabled: toBoolean(pros.enabled, true),
    labelWidth: toNumber(pros.labelWidth),
    labelVisible: toBoolean(pros.labelVisible, true),
    multiWidth: valueofWidth(pros.multiWidth, '235px'),
    multiHeight: valueofHeight(pros.multiHeight, '26px'),
    tableName: getTableName(control),
    columnName: getColumnName(control),
    idColumnName: getIDColumnName(control),
    dropDownSource: getDropDownSource(control)
  }
  return <JGRadioGroup {...props}></JGRadioGroup>
}

export default JGRadioGroup
export { convert, JGRadioGroup }
