import { Control } from '@v-act/schema-types'
import {
  toBoolean,
  toNumber,
  valueofWidth,
  valueofHeight,
  getColumnName,
  getTableName
} from '@v-act/widget-utils'
import JGRichTextEditor, { JGRichTextEditorProps } from './JGRichTextEditor'

const convert = function (control: Control): JSX.Element {
  console.log('control')
  console.log(control)

  const pros = control.properties
  const props: JGRichTextEditorProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: valueofWidth(pros.multiWidth, '235px'),
    height: valueofHeight(pros.multiHeight, '26px'),
    tablename: getTableName(control),
    columnname: getColumnName(control),
    control: control
  }
  return <JGRichTextEditor {...props}></JGRichTextEditor>
}
export { convert, JGRichTextEditor }
