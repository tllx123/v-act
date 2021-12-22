import { Control, ControlReact, ReactEnum } from '@v-act/schema-types'
import { toNumber, valueofHeight, valueofWidth } from '@v-act/widget-utils'

import { JGComponent, JGComponentProps } from './JGComponent'

const convert = function (
  control: Control,
  render: (
    controls: Array<Control>,
    containerReact: ControlReact
  ) => JSX.Element | null
): JSX.Element {
  const pros = control.properties
  const props: JGComponentProps = {
    top: toNumber(pros.top, 0) + 'px',
    left: toNumber(pros.left, 0) + 'px',
    width: valueofWidth(pros.multiWidth, ReactEnum.Space),
    height: valueofHeight(pros.multiHeight, ReactEnum.Space)
  }
  return (
    <JGComponent {...props}>
      {render(control.controls, {
        height: parseInt(pros.height || '450'),
        width: parseInt(pros.width || '960')
      })}
    </JGComponent>
  )
}

export { convert, JGComponent }
