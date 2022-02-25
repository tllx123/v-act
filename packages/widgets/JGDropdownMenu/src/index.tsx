import {
  Control,
  WidgetRenderContext,
  WidgetRenderer
} from '@v-act/schema-types'
import { toBoolean, toNumber } from '@v-act/widget-utils'

import { JGDropdownMenu, JGDropdownMenuProps } from './JGDropdownMenu'

const JsonJGDropdownMenu = function (props: {
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
  const props: JGDropdownMenuProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: toNumber(pros.multiWidth) + 'px',
    height: toNumber(pros.multiHeight) + 'px',
    visible: toBoolean(pros.visible, true)
  }
  return <JGDropdownMenu {...props}></JGDropdownMenu>
}

export default JGDropdownMenu

export { convert, JGDropdownMenu, JsonJGDropdownMenu }
