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
define('./index', function (require, exports, module) {
  var vds = window.vds
  if (!vds) {
    vds = {}
    window.vds = vds
  }
  var progress = vds.progress
  if (!progress) {
    progress = {}
    vds.progress = progress
  }

  exports = progress

  var sandbox, progressBarUtil, scopeManager

  exports.initModule = function (sBox) {
    sandbox = sBox
    progressBarUtil = sBox.getService(
      'vjs.framework.extension.platform.services.view.widget.common.progressbar.ProgressBarUtil'
    )
    scopeManager = sBox.getService(
      'vjs.framework.extension.platform.interface.scope.ScopeManager'
    )
  }

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
  exports.show = function (msg, params) {
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
    var fun = scopeManager.createScopeHandler({
      scopeId: currentScopeId,
      handler: function () {
        progressBarUtil.hideProgress(isG)
      }
    })
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
  exports.hide = function (params) {
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

  module.exports = exports
})
