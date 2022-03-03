import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
let undefined

exports.initModule = function (sb) {}

let main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    expressionSrc = argsLen >= 1 ? args[0] : null

  let widget = widgetContext.get(expressionSrc, 'widgetObj')
  if (widget) return widget.getSelectDate()
  return null
}

export { main }
