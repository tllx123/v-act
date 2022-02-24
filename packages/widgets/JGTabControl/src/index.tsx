import {
  Control,
  JGTabControlProperty,
  WidgetRenderContext,
  WidgetRenderer
} from '@v-act/schema-types'
import { toBoolean, toCssAxisVal, toNumber } from '@v-act/widget-utils'

import {
  Aligment,
  ScrollbarDirection,
  TabAppearance,
  valueofAligment,
  valueofScrollbarDirection,
  valueofTabAppearance
} from './Enums'
import { JGTabControl, JGTabControlProps } from './JGTabControl'
import { convert as convertJGTabPage, JGTabPage } from './JGTabPage'

const convert = function (
  control: Control,
  render: WidgetRenderer,
  componentCode: string,
  context: WidgetRenderContext
): JSX.Element {
  const pros: JGTabControlProperty = control.properties
  const props: JGTabControlProps = {
    top: toCssAxisVal(pros.top, '0px'),
    left: toCssAxisVal(pros.left, '0px'),
    multiWidth: toCssAxisVal(pros.multiWidth, '200px'),
    multiHeight: toCssAxisVal(pros.multiHeight, '100px'),
    visible: toBoolean(pros.visible, true),
    selectedIndex: toNumber(pros.selectedIndex, 0),
    disabled: !toBoolean(pros.enabled, true),
    alignment: pros.alignment ? valueofAligment(pros.alignment) : Aligment.Top,
    tabHeadWidth: toNumber(pros.tabHeadWidth, 110),
    scrollbarDir: pros.scrollbarDir
      ? valueofScrollbarDirection(pros.scrollbarDir)
      : ScrollbarDirection.Both,
    tabAppearance: pros.tabAppearance
      ? valueofTabAppearance(pros.tabAppearance)
      : TabAppearance.Line
  }
  return (
    <JGTabControl {...props}>
      {control.controls
        ? control.controls.map((con: Control) => {
            return convertJGTabPage(con, render, control)
          })
        : null}
    </JGTabControl>
  )
}

const JsonJGTabControl = function (props: {
  control: Control
  render: WidgetRenderer
  componentCode: string
  context: WidgetRenderContext
}) {
  return convert(
    props.control,
    props.render,
    props.componentCode,
    props.context
  )
}

export default JGTabControl

export { convert, JGTabControl, JGTabPage, JsonJGTabControl }
