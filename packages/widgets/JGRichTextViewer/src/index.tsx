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

import { JGRichTextViewer, JGRichTextViewerProps } from './JGRichTextViewer'

const JsonJGRichTextViewer = function (props: {
  control: Control
  render: WidgetRenderer
  componentCode: string
  context: WidgetRenderContext
}) {
  return convert(props.control, props.render)
}

const convert = function (
  control: Control,
  render: WidgetRenderer
): JSX.Element {
  const pros = control.properties
  const props: JGRichTextViewerProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    multiWidth: valueofWidth(pros.multiWidth, '395px'),
    multiHeight: valueofHeight(pros.multiHeight, '344px'),
    tableName: getTableName(control),
    columnName: getColumnName(control)
  }
  return <JGRichTextViewer {...props}></JGRichTextViewer>
}

export default JGRichTextViewer

export { convert, JGRichTextViewer, JsonJGRichTextViewer }
