import { FunctionComponent, ReactElement } from 'react'

import {
  Control,
  ReactEnum,
  WidgetRenderContext,
  WidgetRenderer,
  Window
} from '@v-act/schema-types'
import {
  toEntities,
  toNumber,
  valueofHeight,
  valueofWidth
} from '@v-act/widget-utils'

import { JGComponent, JGComponentProps } from './JGComponent'
import { useContext } from '@v-act/widget-context'

const convert = function (
  control: Control,
  render: WidgetRenderer,
  componentCode: string,
  context: WidgetRenderContext
): ReactElement | null {
  const win = control as Window
  const pros = control.properties
  const props: JGComponentProps = {
    top: toNumber(pros.top, 0) + 'px',
    left: toNumber(pros.left, 0) + 'px',
    padding: pros.padding,
    width: valueofWidth(pros.multiWidth, ReactEnum.Space),
    height: valueofHeight(pros.multiHeight, ReactEnum.Space),
    entities: toEntities(win.entities)
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

const JsonJGComponent: FunctionComponent<{
  control: Control
  render: WidgetRenderer
  componentCode: string
  context: WidgetRenderContext
}> = function (props: {
  control: Control
  render: WidgetRenderer
  componentCode: string
  context: WidgetRenderContext
}) {
  const ctx = useContext()
  props.context.setContext(ctx)
  return convert(
    props.control,
    props.render,
    props.componentCode,
    props.context
  )
}

export { convert, JGComponent, JsonJGComponent }
