import {
  Control,
  toBoolean,
  toNumber,
  WidgetRenderContext,
  WidgetRenderer
} from '@v-act/schema-types'

import { JGStartMenu, JGStartMenuProps } from './JGStartMenu'

const JsonJGStartMenu = function (props: {
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
  const props: JGStartMenuProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: toNumber(pros.multiWidth) + 'px',
    height: toNumber(pros.multiHeight) + 'px',
    visible: toBoolean(pros.visible, true)
  }
  return <JGStartMenu {...props}></JGStartMenu>
}

export default JGStartMenu

export { convert, JGStartMenu, JsonJGStartMenu }
