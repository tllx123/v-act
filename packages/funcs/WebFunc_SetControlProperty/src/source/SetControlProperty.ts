import { ExceptionFactory as factory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { WidgetProperty as widgetProperty } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import { Log as log } from '@v-act/vjs.framework.extension.util.logutil'

export function initModule(sb) {
  sandbox = sb
}

//主入口(必须有)
const main = function (param) {
  //debugger;

  //获取函数传入的参数
  let args = param.getArgs()

  if (param == undefined || args.length < 3) {
    let exception = factory.create({
      type: factory.TYPES.Dialog,
      message:
        '函数SetControlProperty参数不能少于3个，当前' +
        args.length +
        '个！' +
        args.toString()
    })
    throw exception
  }

  let Controls = args[0] //控件编码，多个逗号间隔
  let PropertyName = args[1] //属性名称
  let PropertyValue = args[2] //属性值

  if (Controls == undefined || Controls === '') {
    let exception = factory.create({
      type: factory.TYPES.Dialog,
      message: '控件编码不能为空！'
    })
    throw exception
  }
  Controls = Controls.trim()

  if (PropertyName == undefined || PropertyName === '') {
    let exception = factory.create({
      type: factory.TYPES.Dialog,
      message: '属性名称不能为空！'
    })
    throw exception
  }
  PropertyName = PropertyName.trim()

  if (PropertyValue == undefined) {
    let exception = factory.create({
      type: factory.TYPES.Dialog,
      message: '属性值不能为undefined！'
    })
    throw exception
  }

  let widget
  let widgetCode = ''
  let ControlList = Controls.split(',')
  for (let i = 0; i < ControlList.length; i++) {
    widgetCode = ControlList[i].trim()
    widget = widgetContext.get(widgetCode, 'widgetObj')
    if (widget) {
      try {
        widgetProperty.set(widgetCode, PropertyName, PropertyValue)
      } catch (e) {
        let widgetType = widgetContext.getType(widgetCode)
        let chineseTitleName = widgetProperty.get(
          widgetCode,
          'SimpleChineseTitle'
        )
        log.warn(
          '[webfunc_SetControlProperty]:设置' +
            widgetCode +
            '(' +
            widgetType +
            ')属性' +
            PropertyName +
            '值' +
            PropertyValue +
            '出错。'
        )
      }
    }
  }
}

export { main }
