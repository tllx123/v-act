import { Control } from '@v-act/schema-types'
import {
  toBoolean,
  toNumber,
  valueofHeight,
  valueofWidth
} from '@v-act/widget-utils'

import JGTreeView, { JGTreeViewProps } from './JGTreeView'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties
  const props: JGTreeViewProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: valueofWidth(pros.multiWidth, '200px'),
    height: valueofHeight(pros.multiHeight, '200px'),
    disable: !toBoolean(pros.enabled, true),
    readonly: toBoolean(pros.readOnly, false)
  }
  return <JGTreeView {...props}></JGTreeView>
}

export { convert, JGTreeView }
