import {
  Control,
  WidgetRenderContext,
  WidgetRenderer
} from '@v-act/schema-types'
import {
  toBoolean,
  toNumber,
  valueofHeight,
  valueofWidth
} from '@v-act/widget-utils'

import { JGAttachment, JGAttachmentProps } from './JGAttachment'

const convert = function (
  control: Control,
  render: WidgetRenderer,
  componentCode: string,
  context: WidgetRenderContext
): JSX.Element {
  console.log('control', control)
  const pros = control.properties
  const props: JGAttachmentProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: valueofWidth(pros.multiWidth, '294px'),
    height: valueofHeight(pros.multiHeight, '26px'),
    multiWidth: valueofWidth(pros.multiWidth, '294px'),
    multiHeight: valueofHeight(pros.multiHeight, '26px'),
    labelText: pros.labelText || '文本',
    isMust: toBoolean(pros.isMust),
    placeholder: pros.placeholder,
    visible: toBoolean(pros.visible, true),
    labelWidth: toNumber(pros.labelWidth),
    labelVisible: toBoolean(pros.labelVisible, true),
    disabled: !toBoolean(pros.enabled, true),
    showUploadList: toBoolean(pros.showUploadList, true)
  }
  return <JGAttachment {...props}></JGAttachment>
}

const JsonJGAttachment = function (props: {
  control: Control
  render: WidgetRenderer
  componentCode: string
  context: WidgetRenderContext
}) {
  return convert(
    props.control,
    props.render,
    props.componentCode,
    props.context
  )
}

export default JGAttachment

export { convert, JGAttachment, JsonJGAttachment }
