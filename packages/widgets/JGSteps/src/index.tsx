import {
  Control,
  WidgetRenderContext,
  WidgetRenderer
} from '@v-act/schema-types'
import {
  getColumnName,
  getTableName,
  toNumber,
  valueofHeight,
  valueofWidth
} from '@v-act/widget-utils'

import JGSteps, { JGStepsProps } from './JGSteps'

const JsonJGSteps = function (props: {
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
  const props: JGStepsProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: valueofWidth(pros.multiWidth, '330px'),
    height: valueofHeight(pros.multiHeight, '40px'),
    tableName: getTableName(control),
    columnName: getColumnName(control),
    direction: pros.direction,
    stepDownSource: JSON.parse((pros as any)['stepDownSource']) as any
  }
  return <JGSteps {...props} />
}

export { JGSteps, JsonJGSteps }
