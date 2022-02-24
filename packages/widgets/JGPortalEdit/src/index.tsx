import {
  Control,
  toNumber,
  WidgetRenderContext,
  WidgetRenderer
} from '@v-act/schema-types'

import { JGPortalEdit, JGPortalEditProps } from './JGPortalEdit'

const JsonJGPortalEdit = function (props: {
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
  const props: JGPortalEditProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: toNumber(pros.multiWidth) + 'px',
    height: toNumber(pros.multiHeight) + 'px'
  }
  return <JGPortalEdit {...props}></JGPortalEdit>
}

export default JGPortalEdit

export { convert, JGPortalEdit, JsonJGPortalEdit }
