import {
  Control,
  toBoolean,
  toNumber,
  valueofHeight,
  valueofWidth
} from '@v-act/schema-types'

import { JGWebBrowser, JGWebBrowserProps } from './JGWebBrowser'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties
  const props: JGWebBrowserProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px'
  }
  return <JGWebBrowser {...props}></JGWebBrowser>
}

export default JGWebBrowser

export { convert, JGWebBrowser }
