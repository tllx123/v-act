import {
  Control,
  WidgetRenderContext,
  WidgetRenderer
} from '@v-act/schema-types'
import { toBoolean, toNumber } from '@v-act/widget-utils'

import { JGLocateBox, JGLocateBoxProps } from './JGLocateBox'

const JsonJGLocateBox = function (props: {
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
  const props: JGLocateBoxProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: toNumber(pros.multiWidth) + 'px',
    height: toNumber(pros.multiHeight) + 'px',
    hint: pros.hint ? pros.hint : undefined,
    visible: toBoolean(pros.visible, true),
    disabled: !toBoolean(pros.enabled, true)
  }
  return <JGLocateBox {...props}></JGLocateBox>
}

export default JGLocateBox

export { convert, JGLocateBox, JsonJGLocateBox }
