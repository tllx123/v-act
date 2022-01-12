import { Control } from '@v-act/schema-types'
import {
  getColumnName,
  getTableName,
  toBoolean,
  toNumber,
  valueofHeight,
  valueofWidth
} from '@v-act/widget-utils'

import { JGPassword, JGPasswordProps } from './JGPassword'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element
): JSX.Element {
  const pros = control.properties
  const props: JGPasswordProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: valueofWidth(pros.multiWidth, '235px'),
    height: valueofHeight(pros.multiHeight, '26px'),
    multiWidth: valueofWidth(pros.multiWidth, '235px'),
    multiHeight: valueofHeight(pros.multiHeight, '26px'),
    labelText: pros.labelText || '文本',
    isMust: toBoolean(pros.isMust, false),
    placeholder: pros.placeholder,
    visible: toBoolean(pros.visible, true),
    labelWidth: toNumber(pros.labelWidth),
    labelVisible: toBoolean(pros.labelVisible, true),
    disabled: !toBoolean(pros.enabled, true),
    tableName: getTableName(control),
    columnName: getColumnName(control)
  }
  return <JGPassword {...props}></JGPassword>
}

export default JGPassword

export { convert, JGPassword }
