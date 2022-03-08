import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'

export function initModule(sb) {}

const main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    expressionSrc = argsLen >= 1 ? args[0] : null

  let widget = widgetContext.get(expressionSrc, 'widgetObj')
  if (widget) return widget.getCurrentMonth()
  return null
}

export { main }
