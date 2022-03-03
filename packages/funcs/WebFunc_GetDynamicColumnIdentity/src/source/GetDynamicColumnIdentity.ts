import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
let sandbox
//初始化vjs模块，如果函数逻辑需要引用相关vjs服务，则初始化相关vjs模块；如果不需要初始化逻辑可以为空
exports.initModule = function (sb) {
  //sb：前台vjs的沙箱（容器/上下文），可以用它根据vjs名称，获取到相应vjs服务
  sandbox = sb
}

//主入口(必须有)
let main = function (param) {
  //获取函数传入的参数
  let args = param.getArgs()
  let routeContext = param.getRouteContext() //获取路由上下文，函数里想执行一些表达式逻辑需要用到
  //获取参数
  let widgetId = args[0] //获取函数第一个参数：树表构件编号
  let columnName = args[1] //获取函数第二个参数：实体字段编号
  let widget = widgetContext.get(widgetId, 'widgetObj')
  if (widget && columnName) {
    let field = widget.lastClickField
    if (field && field.remark) {
      return field.remark[columnName]
    }
  }
  return null
  //...
  //根据参数实现函数处理逻辑
  //todo:
}

export { main }
