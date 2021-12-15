import { Control, toNumber } from '@v-act/schema-types'

import { JGPortalEdit, JGPortalEditProps } from './JGPortalEdit'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties
  const props: JGPortalEditProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: toNumber(pros.multiWidth) + 'px',
    height: toNumber(pros.multiHeight) + 'px'
  }
  return <JGPortalEdit {...props}></JGPortalEdit>
}

export default JGPortalEdit

export { convert, JGPortalEdit }
