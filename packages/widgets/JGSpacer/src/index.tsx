import {
  Control,
  WidgetRenderContext,
  WidgetRenderer
} from '@v-act/schema-types'
import { toNumber, valueofHeight, valueofWidth } from '@v-act/widget-utils'

import { JGSpacer, JGSpacerProps } from './JGSpacer'

const JsonJGSpacer = function (props: {
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
  const props: JGSpacerProps = {
    top: toNumber(pros.top, 0) + 'px',
    left: toNumber(pros.left, 0) + 'px',
    multiWidth: valueofWidth(pros.multiWidth, '235px'),
    multiHeight: valueofHeight(pros.multiHeight, '26px')
  }
  return <JGSpacer {...props}></JGSpacer>
}

export default JGSpacer

export { convert, JGSpacer, JsonJGSpacer }
