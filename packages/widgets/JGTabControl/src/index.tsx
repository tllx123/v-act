import React from 'react'
import { Control, toNumber, toBoolean } from '@v-act/schema-types'
import {
  JGTabControl,
  JGTabControlProps,
  Aligment,
  ScrollbarDirection,
  TabAppearance
} from './JGTabControl'
import { JGTabPage, convert as convertJGTabPage } from './JGTabPage'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties
  const props: JGTabControlProps = {
    top: toNumber(pros.top),
    left: toNumber(pros.left),
    visible: toBoolean(pros.visible, true),
    alignment: pros.alignment ? pros.alignment : Aligment.Top,
    scrollbarDir: pros.scrollbarDir
      ? pros.scrollbarDir
      : ScrollbarDirection.Both,
    tabAppearance: pros.tabAppearance ? pros.tabAppearance : TabAppearance.Line
  }
  return (
    <JGTabControl {...props}>
      {control.controls
        ? control.controls.map((control: Control) => {
            return (
              <React.Fragment key={control.code}>
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
