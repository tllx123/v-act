import {
  Control,
  WidgetRenderContext,
  WidgetRenderer
} from '@v-act/schema-types'
import {
  toBoolean,
  toNumber,
  valueofHeight,
  valueofWidth
} from '@v-act/widget-utils'

import { JGButtonGroup, JGButtonGroupProps } from './JGButtonGroup'

const JsonJGButtonGroup = function (props: {
  control: Control
  render: WidgetRenderer
  componentCode: string
  context: WidgetRenderContext
}) {
  return convert(props.control)
}

const convert = function (control: Control): JSX.Element {
  const pros = control.properties
  const props: JGButtonGroupProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: valueofWidth(pros.multiWidth, '235px'),
    height: valueofHeight(pros.multiHeight, '30px'),
    enabled: !toBoolean(pros.enabled, true),
    showBorder: toBoolean(pros.showBorder, true),
    expandWhenHover: !toBoolean(pros.expandWhenHover, true),
    control: control
  }
  return <JGButtonGroup {...props}></JGButtonGroup>
}

export { convert, JGButtonGroup, JsonJGButtonGroup }
