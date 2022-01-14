import { Control } from '@v-act/schema-types'
import {
  getColumnName,
  getTableName,
  toNumber,
  valueofHeight,
  valueofWidth
} from '@v-act/widget-utils'

import JGSteps, { JGStepsProps } from './JGSteps'

export const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties
  const props: JGStepsProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: valueofWidth(pros.multiWidth, '330px'),
    height: valueofHeight(pros.multiHeight, '40px'),
    tableName: getTableName(control),
    columnName: getColumnName(control),
    stepDownSource: JSON.parse((pros as any)['stepDownSource']) as any
  }
  return <JGSteps {...props} />
}

export { JGSteps }
