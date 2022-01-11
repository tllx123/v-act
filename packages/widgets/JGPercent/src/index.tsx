import { Control } from '@v-act/schema-types'
import {
  getColumnName,
  getTableName,
  toBoolean,
  toNumber,
  valueofHeight,
  valueofWidth
} from '@v-act/widget-utils'

import { JGPercent, JGPercentProps } from './JGPercent'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties
  const props: JGPercentProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    visible: toBoolean(pros.visible, true),
    multiWidth: valueofWidth(pros.multiWidth, '235px'),
    multiHeight: valueofHeight(pros.multiHeight, '26px'),
    tableName: getTableName(control),
    columnName: getColumnName(control)
  }
  return <JGPercent {...props}></JGPercent>
}

export default JGPercent
export { convert, JGPercent }
