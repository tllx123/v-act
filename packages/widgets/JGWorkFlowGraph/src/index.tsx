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

import { JGWorkFlowGraph, JGWorkFlowGraphProps } from './JGWorkFlowGraph'

const JsonJGWorkFlowGraph = function (props: {
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
  const props: JGWorkFlowGraphProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    visible: toBoolean(pros.visible, true),
    multiWidth: valueofWidth(pros.multiWidth, '235px'),
    multiHeight: valueofHeight(pros.multiHeight, '26px')
  }
  return <JGWorkFlowGraph {...props}></JGWorkFlowGraph>
}

export default JGWorkFlowGraph
export { convert, JGWorkFlowGraph, JsonJGWorkFlowGraph }
