import { ExceptionFactory as factory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'

export function initModule(sb) {
  sandbox = sb
}

//主入口(必须有)
const main = function (param) {
  //获取函数传入的参数
  let args = param.getArgs()
  let widgetCode = args[0]
  let fieldStr = args[1]
  let visible = args[2]
  if (widgetCode == undefined || widgetCode === '') {
    let exception = factory.create({
      type: factory.TYPES.Dialog,
      message: '列表控件名不能为空！'
    })
    throw exception
  }
  if (fieldStr == undefined || fieldStr === '') {
    let exception = factory.create({
      type: factory.TYPES.Dialog,
      message: '需要设置的字段名不能为空！'
    })
    throw exception
  }
  if (visible == undefined || visible === '') {
    let exception = factory.create({
      type: factory.TYPES.Dialog,
      message: '需要设置的显示值不能为空！'
    })
    throw exception
  }
  let widget = widgetContext.get(widgetCode, 'widgetObj')
  let fieldList = fieldStr.split(',')
  if (visible == 'false' || visible == false) {
    visible = false
  } else {
    visible = true
  }
  for (let i = 0; i < fieldList.length; i++) {
    let field = widget.getFieldByName(fieldList[i])
    if (field) {
      if (visible) {
        widget._widget.showField(field)
      } else {
        widget._widget.hideField(field)
      }
    }
  }
}

export { main }
