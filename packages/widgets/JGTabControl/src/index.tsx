import {
  Control,
  ControlReact,
  JGTabControlProperty
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
  render: (
    controls: Array<Control>,
    containerReact: ControlReact
  ) => JSX.Element | null
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

export default JGTabControl

export { convert, JGTabControl, JGTabPage }
