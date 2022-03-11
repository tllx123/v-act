import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'

const main = function (param: Record<string, any>) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    expressionSrc = argsLen >= 1 ? args[0] : null

  let widget = widgetContext.get(expressionSrc, 'widgetObj')
  if (widget) return widget.getSelectDate()
  return null
}

export { main }
