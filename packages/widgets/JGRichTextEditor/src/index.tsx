import {
  Control,
  WidgetRenderContext,
  WidgetRenderer
} from '@v-act/schema-types'
import {
  getColumnName,
  getTableName,
  toNumber,
  valueofHeight,
  valueofWidth
} from '@v-act/widget-utils'

import JGRichTextEditor, { JGRichTextEditorProps } from './JGRichTextEditor'

const JsonJGRichTextEditor = function (props: {
  control: Control
  render: WidgetRenderer
  componentCode: string
  context: WidgetRenderContext
}) {
  return convert(props.control)
}

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
export { convert, JGRichTextEditor, JsonJGRichTextEditor }
