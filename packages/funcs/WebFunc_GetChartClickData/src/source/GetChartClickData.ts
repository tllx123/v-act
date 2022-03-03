import { ExceptionFactory as factory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
//初始化vjs模块，如果函数逻辑需要引用相关vjs服务，则初始化相关vjs模块；如果不需要初始化逻辑可以为空
let sandbox
let undefined
let undefined
exports.initModule = function (sb) {
  //sb：前台vjs的沙箱（容器/上下文），可以用它根据vjs名称，获取到相应vjs服务
  sandbox = sb
}

//主入口(必须有)
let main = function (param) {
  //获取函数传入的参数(获取唯一的图表控件)
  let args = param.getArgs()
  if (args.length != 2) {
    let exception = factory.create({
      type: factory.TYPES.Dialog,
      message: '函数参数个数必须为2个!'
    })
    throw exception
  }
  //图表构件编码
  let widgetCode = args[0]
  //实体字段编码
  let fieldCode = args[1]
  if (!widgetCode || '' == widgetCode) {
    let exception = factory.create({
      type: factory.TYPES.Dialog,
      message: '函数第一个参数,图表控件编码不能为空!'
    })
    throw exception
  }
  if (!fieldCode || '' == fieldCode) {
    let exception = factory.create({
      type: factory.TYPES.Dialog,
      message: '函数第二个参数,图表的字段编码不能为空!'
    })
    throw exception
  }
  let relValue = ''
  let widget = widgetContext.get(widgetCode, 'widgetObj')
  let barClickData = widget.clickBarData
  if (barClickData && barClickData != null && barClickData != undefined) {
    for (barCode in barClickData) {
      if (barCode == fieldCode) {
        relValue = barClickData[barCode]
        break
      }
    }
  }

  return relValue
}

export { main }
