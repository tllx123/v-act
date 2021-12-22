import { Control, JGWebBrowserProperty } from '@v-act/schema-types'
import { toCssAxisVal } from '@v-act/widget-utils'

import { JGWebBrowser, JGWebBrowserProps } from './JGWebBrowser'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties as JGWebBrowserProperty
  const props: JGWebBrowserProps = {
    top: toCssAxisVal(pros.top, '0px'),
    left: toCssAxisVal(pros.left, '0px'),
    url: pros.webURL
  }
  return <JGWebBrowser {...props}></JGWebBrowser>
}

export default JGWebBrowser
export { convert, JGWebBrowser }
