import { Control } from '@v-act/schema-types'
import {
  toBoolean,
  toNumber,
  valueofWidth,
  valueofHeight,
  getColumnName,
  getTableName
} from '@v-act/widget-utils'
import JGComponentContainer, {
  JGComponentContainerProps
} from './JGComponentContainer'

const convert = function (control: Control): JSX.Element {
  console.log(control.properties.labelText)
  console.log('control')
  console.log(control)

  const pros = control.properties

  const props: JGComponentContainerProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: valueofWidth(pros.multiWidth, '235px'),
    height: valueofHeight(pros.multiHeight, '26px'),
    bodercolor: pros.boderColor,
    visible: toBoolean(pros.visible, true),
    tableName: getTableName(control),
    columnName: getColumnName(control)
  }
  return <JGComponentContainer {...props}></JGComponentContainer>
}

export { convert, JGComponentContainer }
