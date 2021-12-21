import { Control, toBoolean, toNumber } from '@v-act/schema-types'

import JGTreeView, { JGTreeViewProps } from './JGTreeView'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties
  const props: JGTreeViewProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: toNumber(pros.multiWidth) + 'px',
    height: toNumber(pros.multiHeight) + 'px',
    disable: !toBoolean(pros.enabled, true),
    readonly: toBoolean(pros.readOnly, false)
  }
  return <JGTreeView {...props}></JGTreeView>
}

export { convert, JGTreeView }
