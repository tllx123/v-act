import { Control } from '@v-act/schema-types'
import {
  getColumnName,
  getTableName,
  toNumber,
  valueofHeight,
  valueofWidth
} from '@v-act/widget-utils'

import { JGRichTextViewer, JGRichTextViewerProps } from './JGRichTextViewer'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
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

export { convert, JGRichTextViewer }
