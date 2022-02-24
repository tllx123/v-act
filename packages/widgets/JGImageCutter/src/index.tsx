import {
  Control,
  WidgetRenderContext,
  WidgetRenderer
} from '@v-act/schema-types'
import { toNumber } from '@v-act/widget-utils'

import { JGImageCutter, JGImageCutterProps } from './JGImageCutter'

const JsonJGImageCutter = function (props: {
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
  const props: JGImageCutterProps = {
    top: toNumber(pros.top),
    left: toNumber(pros.left)
  }
  console.log(123)
  return <JGImageCutter {...props}></JGImageCutter>
}

export default JGImageCutter
export { convert, JGImageCutter, JsonJGImageCutter }
