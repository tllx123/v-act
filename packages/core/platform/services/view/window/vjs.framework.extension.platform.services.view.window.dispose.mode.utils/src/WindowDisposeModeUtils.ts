/**
 * 退出窗体规则移到这里（规则正式名：BR_SelectionConfirm）
 */

import { ScopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import {
  Browser as browser,
  BrowserUtil as browserUtil
} from '@v-act/vjs.framework.extension.platform.services.browser'
import { WindowParam as windowParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { WidgetAction as widgetAction } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

export function dispose(ruleContext) {
  var inParamsObj = jsonUtil.json2obj(ruleContext.getRuleCfg()['inParams'])
  //用户的确定或取消选项 , 0：取消；1：确定
  var selectionConfirm = inParamsObj['SelectionConfirm']
  //输出类型,currentRow:当前行,selectRow:选中行,allRow:所有行
  var isClickConfirm = selectionConfirm == '1'
  var outputType = 'allRow'
  //是否点击了确定

  //是否需要返回记录
  var isNeedReturnValue = isClickConfirm
  var scope = ScopeManager.getWindowScope()
  //如果点击确定退出，就标记域为确定退出状态
  if (isClickConfirm) {
    scope.markSelectionConfirmed()
  }
  var closeMode = scope.getCloseMode()
  if (closeMode) {
    //关闭模式优先级最高，后续需要废弃窗体输入【formulaOpenMode】方式传递打开方式，兼容或者改造openMode
    switch (closeMode) {
      case ScopeManager.CloseMode.DestroyScope:
        var windowScope = ScopeManager.getWindowScope()
        ScopeManager.destroy(scope.getInstanceId())
        break
      case ScopeManager.CloseMode.CustomFunc:
        var func = scope.getCustomCloseFunc()
        if (typeof func == 'function') {
          var rootRouteContext = ruleContext.getRouteContext()
          while (true) {
            var parentRouteContext = rootRouteContext.getParentRouteContext()
            if (parentRouteContext) {
              rootRouteContext = parentRouteContext
            } else {
              break
            }
          }
          //如果直接执行回调，会引发本窗体事务未提交情况下执行父窗体逻辑，会引发父窗体逻辑获取不到本窗体修改的数据
          rootRouteContext.onRouteCallBack(func)
        }
        break
    }
    return
  }

  //获取打开方式标识
  var openMode
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
      if (scope) {
        scope.set('CloseIden', isClickConfirm) //设置关闭标识，容器中退出窗体时，回调要用
      }
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
        browserUtil.closeWindow({
          isConfirmExit: isClickConfirm
        }) //没有通过打开组件规则打开的，组件变量都不存在，关闭当前窗口
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
const markInterrupt = function (ruleContext) {
  const routeContext = ruleContext.getRouteContext()
  routeContext.markForInterrupt(routeContext.INSTANCE)
}
