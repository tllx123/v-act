import { Control, JGReportProperty } from '@v-act/schema-types'
import {
  toBoolean,
  toCssAxisVal,
  valueofHeight,
  valueofWidth
} from '@v-act/widget-utils'

import { JGReport, JGReportProps } from './JGReport'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties as JGReportProperty
  const props: JGReportProps = {
    top: toCssAxisVal(pros.top, '0px'),
    left: toCssAxisVal(pros.left, '0px'),
    multiWidth: valueofWidth(pros.multiWidth, '235px'),
    multiHeight: valueofHeight(pros.multiHeight, '26px'),
    visible: toBoolean(pros.visible, true),
    isShowToolbar: toBoolean(pros.isShowToolbar, true)
  }
  return <JGReport {...props}></JGReport>
}

export { convert, JGReport, type JGReportProps }
