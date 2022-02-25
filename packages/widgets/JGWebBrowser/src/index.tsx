import {
  Control,
  JGWebBrowserProperty,
  WidgetRenderContext,
  WidgetRenderer
} from '@v-act/schema-types'
import { toCssAxisVal, valueofHeight, valueofWidth } from '@v-act/widget-utils'

import { JGWebBrowser, JGWebBrowserProps } from './JGWebBrowser'

const JsonJGWebBrowser = function (props: {
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
  const pros = control.properties as JGWebBrowserProperty
  const props: JGWebBrowserProps = {
    top: toCssAxisVal(pros.top, '0px'),
    left: toCssAxisVal(pros.left, '0px'),
    width: valueofWidth(pros.multiWidth, '200px'),
    height: valueofHeight(pros.multiHeight, '200px'),
    url: pros.webURL
  }
  return <JGWebBrowser {...props}></JGWebBrowser>
}

export default JGWebBrowser
export { convert, JGWebBrowser, JsonJGWebBrowser }
