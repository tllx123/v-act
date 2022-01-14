import { Control } from '@v-act/schema-types'
import {
  toBoolean,
  toNumber,
  valueofWidth,
  valueofHeight,
  getColumnName,
  getTableName
} from '@v-act/widget-utils'

import { JGCheckBox, JGCheckBoxProps } from './JGCheckBox'

const convert = function (control: Control): JSX.Element {
  console.log('control')
  console.log(control)

  const pros = control.properties
  const props: JGCheckBoxProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: valueofWidth(pros.multiWidth, '235px'),
    height: valueofHeight(pros.multiHeight, '26px'),
    ismust: toBoolean(pros.isMust, false),
    disabled: !toBoolean(pros.enabled, true),
    labelWidth: toNumber(pros.labelWidth, 94),
    labelVisible: toBoolean(pros.labelVisible, true),
    tableName: getTableName(control),
    columnName: getColumnName(control)
  }
  return <JGCheckBox {...props}></JGCheckBox>
}

export { convert, JGCheckBox }
