import { Control } from '@v-act/schema-types'

import {
  convert as JGQueryConditionPanelConvert,
  JGQueryConditionPanel
} from './JGQueryConditionPanel'
import { JGQueryConditionPanelForm } from './JGQueryConditionPanelForm'
import {
  Align,
  JGQueryConditionPanelToolbar
} from './JGQueryConditionPanelToolbar'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element[] | null
): JSX.Element {
  return JGQueryConditionPanelConvert(control, render)
}

export default JGQueryConditionPanel

export {
  Align,
  convert,
  JGQueryConditionPanel,
  JGQueryConditionPanelForm,
  JGQueryConditionPanelToolbar
}
