import { Control, WidgetRenderer } from '@v-act/schema-types'
import { useContext } from '@v-act/widget-context'
import {
  getColumnName,
  getCompVal,
  getFieldValue,
  getTableName,
  setFieldValue,
  toBoolean,
  toNumber,
  valueofHeight,
  valueofWidth
} from '@v-act/widget-utils'

import JGLongTextBox, { JGLongTextBoxProps } from './JGLongTextBox'

const JsonJGLongTextBox = function (props: {
  control: Control
  render: WidgetRenderer
  componentCode: string
}) {
  let val = getCompVal(props.control)
  props.control.val = {
    valName: val.val,
    tableName: val.tableName,
    columnName: val.columnName
  }
  return convert(props.control)
}

const convert = function (control: Control): JSX.Element {
  const pros = control.properties
  const context = useContext()
  const tableName = getTableName(control)
  const columnName = getColumnName(control)
  const props: JGLongTextBoxProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: valueofWidth(pros.multiWidth, '235px'),
    height: valueofHeight(pros.multiHeight, '26px'),
    ismust: toBoolean(pros.isMust, false),
    placeholder: pros.placeholder,
    disabled: !toBoolean(pros.enabled, true),
    labeltext: pros.labelText || '',
    labelWidth: toNumber(pros.labelWidth, 94),
    labelVisible: toBoolean(pros.labelVisible, true),
    readonly: toBoolean(pros.readOnly, false),
    value:
      tableName && columnName
        ? getFieldValue(tableName, columnName, context) + ''
        : '',
    onChanged: (e) => {
      if (tableName && columnName) {
        setFieldValue(tableName, columnName, e.target.value, context)
      }
    }
  }
  return <JGLongTextBox {...props}></JGLongTextBox>
}

export { JGLongTextBox, JsonJGLongTextBox }
