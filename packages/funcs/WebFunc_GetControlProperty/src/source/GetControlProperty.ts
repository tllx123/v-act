import { log as log } from '@v-act/vjs.framework.extension.util'
import { ExceptionFactory as factory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import { WidgetProperty as widgetProperty } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { WindowVMMappingManager as widgetMapping } from '@v-act/vjs.framework.extension.platform.services.vmmapping.manager'
let undefined
let undefined
let undefined
let undefined
let undefined

exports.initModule = function (sb) {
  sandbox = sb
}

// 主入口(必须有)
let main = function (param) {
  //debugger;

  // 获取函数传入的参数
  let args = param.getArgs()

  if (param == undefined || args.length < 2) {
    let exception = factory.create({
      type: factory.TYPES.Dialog,
      message:
        '函数GetControlProperty参数不能少于2个，当前' +
        args.length +
        '个！' +
        args.toString()
    })
    throw exception
  }

  let widgetCode = args[0] // 控件编码
  let PropertyName = args[1] // 属性名称

  if (widgetCode == undefined || widgetCode === '') {
    let exception = factory.create({
      type: factory.TYPES.Dialog,
      message: '控件编码不能为空！'
    })
    throw exception
  }
  widgetCode = widgetCode.trim()

  if (PropertyName == undefined || PropertyName === '') {
    let exception = factory.create({
      type: factory.TYPES.Dialog,
      message: '属性名称不能为空！'
    })
    throw exception
  }
  PropertyName = PropertyName.trim()

  let widget

  widget = widgetContext.get(widgetCode, 'widgetObj')
  if (widget) {
    let widgetType = widgetContext.getType(widgetCode)

    let PropertyValue = widgetProperty.get(widgetCode, PropertyName)
    if (PropertyValue == null) {
      let ErrorMsg =
        '[webfunc_GetControlProperty]:获取' +
        widgetCode +
        '(' +
        widgetType +
        ')未找到属性' +
        PropertyName +
        '！'
      log.error(ErrorMsg)

      //						var exception = factory.create({
      //							"type" : factory.TYPES.Dialog,
      //							"message" : ErrorMsg
      //						});
      //						throw exception;
    } else {
      return PropertyValue
    }
  } else {
    let ErrorMsg = '[webfunc_GetControlProperty]:未找到控件' + widgetCode + '！'
    log.error(ErrorMsg)

    //					var exception = factory.create({
    //						"type" : factory.TYPES.Dialog,
    //						"message" : ErrorMsg
    //					});
    //					throw exception;
  }
}

export { main }
