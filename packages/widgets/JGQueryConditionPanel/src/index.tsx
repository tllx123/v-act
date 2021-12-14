import { Control, toBoolean, toNumber } from '@v-act/schema-types'

import {
  JGQueryConditionPanel,
  JGQueryConditionPanelProps
} from './JGQueryConditionPanel'
import { JGQueryConditionPanelForm } from './JGQueryConditionPanelForm'
import { JGQueryConditionPanelToolbar } from './JGQueryConditionPanelToolbar'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties
  const props: JGQueryConditionPanelProps = {
    top: toNumber(pros.top),
    left: toNumber(pros.left),
    multiWidth: toNumber(pros.multiWidth) + 'px',
    multiHeight: toNumber(pros.multiHeight) + 'px',
    visible: toBoolean(pros.visible, true)
  }
  return <JGQueryConditionPanel {...props}></JGQueryConditionPanel>
}

export default JGQueryConditionPanel

export {
  convert,
  JGQueryConditionPanel,
  JGQueryConditionPanelForm,
  JGQueryConditionPanelToolbar
}
