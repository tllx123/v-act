import { ScopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import {
  Browser as browser,
  BrowserUtil as browserUtil
} from '@v-act/vjs.framework.extension.platform.services.browser'
import { WindowParam as windowParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { WidgetAction as widgetAction } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

let viewModel

export function initModule(sBox) {}

const main = function (ruleContext) {
  let inParamsObj = jsonUtil.json2obj(ruleContext.getRuleCfg()['inParams'])
  //用户的确定或取消选项 , 0：取消；1：确定
  let selectionConfirm = inParamsObj['SelectionConfirm']
  //输出类型,currentRow:当前行,selectRow:选中行,allRow:所有行
  let outputType = 'allRow'
  //是否点击了确定
  let isClickConfirm = selectionConfirm == '1'
  //是否需要返回记录
  let isNeedReturnValue = isClickConfirm
  //获取打开方式标识
  let openMode
  let scope = ScopeManager.getChildWindowScope()
  if (scope && scope.getOpenMode()) {
    openMode = scope.getOpenMode()
  } else {
    openMode = windowParam.getInput({
      code: 'formulaOpenMode'
    })
  }
  //适配不同的打开方式，使用不同的关闭方式
  markInterrupt(ruleContext)
  switch (openMode + '') {
    case 'locationHref':
      if (scope) {
        scope.set('CloseIden', isClickConfirm) //设置关闭标识，容器中退出窗体时，回调要用
      }
      widgetAction.executeComponentAction('closeComponent')
      break
    case 'dialog':
    case 'retrunValues': //渲染那边用到的是这个
      browser.closeModalWindow({
        selectConfirm: isClickConfirm,
        collectOutput: isNeedReturnValue
      })
      break
    case 'container':
      if (scope) {
        scope.set('CloseIden', isClickConfirm) //设置关闭标识，容器中退出窗体时，回调要用
      }
      widgetAction.executeComponentAction('closeComponent')
      break
    case ScopeManager.OpenMode.ModalContaniner:
      var scopeId
      var winScope = ScopeManager.getChildWindowScope()
      if (winScope) {
        scopeId = winScope.getInstanceId()
      } else {
        scopeId = ScopeManager.getCurrentScopeId()
      }
      var success = function () {
        ScopeManager.destroy(scopeId)
      }
      var error = function () {}
      winScope.fireBeforeClose(success, error)
      break
    case 'vuiWindowContainer':
      var scopeId
      var winScope = ScopeManager.getChildWindowScope()
      if (winScope) {
        scopeId = winScope.getInstanceId()
      } else {
        scopeId = ScopeManager.getCurrentScopeId()
      }
      ScopeManager.destroy(scopeId)
      break
    default:
      var success = function () {
        browserUtil.closeWindow() //没有通过打开组件规则打开的，组件变量都不存在，关闭当前窗口
      }
      var error = function () {}
      var winScope = ScopeManager.getWindowScope()
      winScope.fireBeforeClose(success, error)
      break
  }
  //获取规则链路由上下文,终止执行后续规则
  /*var routeContext = ruleContext.getRouteContext();
    routeContext.markForInterrupt(routeContext.INSTANCE);*/
}

let markInterrupt = function (ruleContext) {
  let routeContext = ruleContext.getRouteContext()
  routeContext.markForInterrupt(routeContext.INSTANCE)
}

export { main }
