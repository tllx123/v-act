import { Control, JGContextProperty } from '@v-act/schema-types'

import { JGContext, JGContextProps } from './JGContext'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros: JGContextProperty = control.properties
  const props: JGContextProps = {
    position: pros.position === 'static' ? 'static' : 'absolute'
  }
  return <JGContext {...props}>{render(control.controls)}</JGContext>
}

export { convert, JGContext }
