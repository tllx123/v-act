import Control from './Control'

interface WidgetConvertArg {
  control: Control
  render: (controls: Array<Control>) => JSX.Element | null
  componentCode: string
}

export { type WidgetConvertArg }
