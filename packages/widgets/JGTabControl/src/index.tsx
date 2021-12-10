import React from 'react'
import { Control, toNumber, toBoolean } from '@v-act/schema-types'
import { JGTabControl, JGTabControlProps } from './JGTabControl'
import { JGTabPage, convert as convertJGTabPage } from './JGTabPage'
import {
  Aligment,
  valueofAligment,
  ScrollbarDirection,
  valueofScrollbarDirection,
  TabAppearance,
  valueofTabAppearance
} from './Enums'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties
  const props: JGTabControlProps = {
    top: toNumber(pros.top),
    left: toNumber(pros.left),
    visible: toBoolean(pros.visible, true),
    alignment: pros.alignment ? valueofAligment(pros.alignment) : Aligment.Top,
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
        ? control.controls.map((control: Control) => {
            return (
              <React.Fragment key={control.properties.code}>
                {convertJGTabPage(control, render)}
              </React.Fragment>
            )
          })
        : null}
    </JGTabControl>
  )
}

export default JGTabControl

export { JGTabControl, JGTabPage, convert }
