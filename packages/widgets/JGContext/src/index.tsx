import { Control, JGContextProperty, WidgetRenderer } from '@v-act/schema-types'

import { JGContext, JGContextProps } from './JGContext'

const convert = function (
  control: Control,
  render: WidgetRenderer,
  componentCode: string,
  context: { router: any; stackInfo: any }
): JSX.Element {
  const pros: JGContextProperty = control.properties
  const props: JGContextProps = {
    position: pros.position === 'static' ? 'static' : 'absolute'
  }
  return <JGContext {...props}>{render(control.controls, null)}</JGContext>
}

const JsonJGContext = function (props: {
  control: Control
  render: WidgetRenderer
  componentCode: string
  context: { router: any; stackInfo: any }
}) {
  return convert(
    props.control,
    props.render,
    props.componentCode,
    props.context
  )
}

export { convert, JGContext, JsonJGContext }
