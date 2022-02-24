import {
  Control,
  WidgetRenderContext,
  WidgetRenderer
} from '@v-act/schema-types'

import {
  convert as JGQueryConditionPanelConvert,
  JGQueryConditionPanel
} from './JGQueryConditionPanel'
import { JGQueryConditionPanelForm } from './JGQueryConditionPanelForm'
import {
  Align,
  JGQueryConditionPanelToolbar
} from './JGQueryConditionPanelToolbar'

const JsonJGQueryConditionPanel = function (props: {
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
  return JGQueryConditionPanelConvert(control, render)
}

export default JGQueryConditionPanel

export {
  Align,
  convert,
  JGQueryConditionPanel,
  JGQueryConditionPanelForm,
  JGQueryConditionPanelToolbar,
  JsonJGQueryConditionPanel
}
