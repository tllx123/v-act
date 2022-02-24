import {
  Control,
  WidgetRenderContext,
  WidgetRenderer
} from '@v-act/schema-types'
import { toNumber, valueofHeight, valueofWidth } from '@v-act/widget-utils'

import { JGPropertyEditor, JGPropertyEditorProps } from './JGPropertyEditor'

const JsonJGPropertyEditor = function (props: {
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
  const props: JGPropertyEditorProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    multiWidth: valueofWidth(pros.multiWidth, '235px'),
    multiHeight: valueofHeight(pros.multiHeight, '26px')
  }
  return <JGPropertyEditor {...props}></JGPropertyEditor>
}

export default JGPropertyEditor

export { convert, JGPropertyEditor, JsonJGPropertyEditor }
