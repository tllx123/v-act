import { Control, toNumber } from '@v-act/schema-types'

import JGSteps, { JGStepsProps } from './JGSteps'

export const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties
  const props: JGStepsProps = {
    top: toNumber(pros.top) + '',
    left: toNumber(pros.left) + '',
    width: toNumber(pros.multiWidth) + '',
    height: toNumber(pros.multiHeight) + ''
  }
  return <JGSteps {...props} />
}

export { JGSteps }
