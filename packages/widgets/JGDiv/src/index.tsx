import {
  Control,
  WidgetRenderContext,
  WidgetRenderer
} from '@v-act/schema-types'
import { toNumber, valueofHeight, valueofWidth } from '@v-act/widget-utils'

import { JGDiv, JGDivProps } from './JGDiv'

const JsonJGDiv = function (props: {
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
  const props: JGDivProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: valueofWidth(pros.multiWidth, '235px'),
    height: valueofHeight(pros.multiHeight, '26px')
  }
  return <JGDiv {...props}></JGDiv>
}

export default JGDiv

export { convert, JGDiv, JsonJGDiv }
