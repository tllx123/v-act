import { ScopeManager as ScopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import { Modal as Modal } from '@v-act/vjs.framework.extension.platform.services.view.modal'
//初始化vjs模块，如果函数逻辑需要引用相关vjs服务，则初始化相关vjs模块；如果不需要初始化逻辑可以为空
let undefined
exports.initModule = function (sb) {
  //sb：前台vjs的沙箱（容器/上下文），可以用它根据vjs名称，获取到相应vjs服务
  sandbox = sb
}

//主入口(必须有)
let main = function (param) {
  //获取函数传入的参数
  let args = param.getArgs()
  let param1 = args[0]
  let windowScope = ScopeManager.getWindowScope()
  let series = windowScope.getSeries()
  let el = gelEl(windowScope, series)
  Modal.setModalWindowState(param1, el)
}
let gelEl = function (windowScope, series) {
  let widgetObj, bodyId, el
  if (series == 'smartclient') {
    widgetObj = widgetContext.get(windowScope.getWindowCode(), 'widgetObj')
    bodyId = widgetObj.htmlElement
    el = $('#' + bodyId).parents('.v-modal-dialog')
  }
  if (series == 'bootstrap') {
    widgetObj = widgetContext.getAll(windowScope.getWindowCode())
    bodyId = widgetObj._ParentContainerInfo.containerCode
    el = $('#' + bodyId).parents('.v-modal-dialog')
  }
  return el
}
export { main }
