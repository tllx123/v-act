/**
 * 进度条方法
 * @desc 提供与进度条相关的一系列接口，使用前请先import：vds.import("vds.progress.*")
 * @namespace vds/progress
 * @module progress
 * @catalog 工具方法/进度条
 * @example
 * vds.import("vds.progress.*");
 * vds.progress.show();
 */
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { ProgressBarUtil as progressBarUtil } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.progressbar'

/**
 * 显示进度条
 * @param {String} 进度条消息
 * @param {RuleContext} ruleContext 规则上下文
 * @param {Object} 其他参数（可选）
 * {
 *  "global":{Boolean} 是否全局进度条，默认true（可选）
 *  "ruleContext": {RuleContext} 规则上下文（可选）
 * }
 * @example
 * vds.progress.show("数据加载中...");
 * vds.progress.show("左侧菜单加载中...",{
 *  "global":false
 * });
 * */
export function show(msg: string | undefined, params: Record<string, any>) {
  if (!msg) {
    return
  }
  var global = params && params.global === false ? false : true
  var winScope = scopeManager.getWindowScope()
  if (!winScope) {
    winScope = scopeManager.getScope()
  }
  var currentScopeId = winScope ? winScope.getInstanceId() : null
  scopeManager.createScopeHandler({
    scopeId: currentScopeId,
    handler: function (_msg, isGlobal) {
      progressBarUtil.showProgress(_msg, isGlobal)
    }
  })(msg, global)

  winScope.on(
    scopeManager.EVENTS.DESTROY,
    (function (sId, isG) {
      return scopeManager.createScopeHandler({
        scopeId: sId,
        handler: function () {
          progressBarUtil.hideProgress(isG)
        }
      })
    })(currentScopeId, global)
  )
  if (params && params.ruleContext) {
    var ruleContext = params.ruleContext
    var routeContext = ruleContext.getMethodContext()._getRouteContext()
    routeContext.on({
      eventName: routeContext.Events.EXCEPTION,
      handler: function () {
        progressBarUtil.hideProgress(global)
      }
    })
    routeContext.on({
      eventName: routeContext.Events.INTERRUPT,
      handler: function () {
        progressBarUtil.hideProgress(global)
      }
    })
  }
}

/**
 * 隐藏进度条
 * @param {Object} 其他参数（可选）
 * {
 *  "global":{Boolean} 是否全局进度条，默认true（可选）
 * }
 * @example
 * vds.progress.hide();
 * vds.progress.hide({
 *  "global":false
 * });
 * */
export function hide(params: Record<string, any>) {
  var global = params && params.global === false ? false : true
  var winScope = scopeManager.getWindowScope()
  if (!winScope) {
    winScope = scopeManager.getScope()
  }
  var currentScopeId = winScope ? winScope.getInstanceId() : null
  scopeManager.createScopeHandler({
    scopeId: currentScopeId,
    handler: function (isGlobal) {
      progressBarUtil.hideProgress(isGlobal)
    }
  })(global)
}
