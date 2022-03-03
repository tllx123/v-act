import { ExceptionFactory as factory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
let undefined
exports.initModule = function (sb) {
  sandbox = sb
}

//主入口(必须有)
let main = function (param) {
  //获取函数传入的参数
  let args = param.getArgs()
  let widgetCode = args[0]
  let fieldStr = args[1]
  let titleStr = args[2]
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
      message: '需要修改的字段名不能为空！'
    })
    throw exception
  }
  if (titleStr == undefined || titleStr === '') {
    let exception = factory.create({
      type: factory.TYPES.Dialog,
      message: '需要设置的列标题不能为空！'
    })
    throw exception
  }
  let widget = widgetContext.get(widgetCode, 'widgetObj')
  let fieldList = fieldStr.split(',')
  let titleList = titleStr.split(',')
  for (let i = 0; i < fieldList.length; i++) {
    let field = widget.getFieldByName(fieldList[i])
    if (field) {
      widget.setFieldTitle(fieldList[i], titleList[i])
    }
  }
}

export { main }
