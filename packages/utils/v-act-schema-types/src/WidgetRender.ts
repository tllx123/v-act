import Control from './Control'
import ControlReact from './ControlReact'

interface WidgetRenderContext {
  router: any
  stackInfo: any
}

type WidgetRenderer = (
  controls: Array<Control>,
  containerReact?: ControlReact | null
) => JSX.Element | JSX.Element[] | null

export { type WidgetRenderContext, type WidgetRenderer }
