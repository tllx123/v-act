import { ExceptionFactory as exceptionFactory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { WidgetAction as widgetAction } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
let sandbox

exports.initModule = function (sb) {
  sandbox = sb
}

let main = function (param) {
  let args = param.args

  let widgetCode = args[0]
  if (!widgetCode)
    exceptionHandler('函数 GetWidgetSize 第一个参数，控件Code不能为空！')

  let valueCode = args[1]
  if (!valueCode || (valueCode !== 'height' && valueCode !== 'width'))
    exceptionHandler(
      '函数 GetWidgetSize 第二个参数，属性 Code 必须为 height 或者 width！'
    )

  if (valueCode)
    return widgetAction.executeWidgetAction(
      widgetCode,
      _genActionMethodName(valueCode)
    )
  else return 0
}

let _genActionMethodName = function (codeName) {
  return 'get' + codeName.substring(0, 1).toUpperCase() + codeName.substring(1)
}

let exceptionHandler = function (message) {
  let exception = exceptionFactory.create({
    type: exceptionFactory.TYPES.Dialog,
    message: message
  })
  throw exception
}

export { main }
