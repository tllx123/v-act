/**
 * 环境相关的方法
 * @desc 提供与环境相关的一系列接口，使用前请先import：vds.import("vds.environment.*")
 * @namespace vds/environment
 * @module environment
 * @catalog 工具方法/环境
 * @example
 * vds.import("vds.environment.*");
 * vds.environment.getContextPath();
 */
define('./index', function (require, exports, module) {
  var vds = window.vds
  if (!vds) {
    vds = {}
    window.vds = vds
  }
  var environment = vds.environment
  if (!environment) {
    environment = {}
    vds.environment = environment
  }

  exports = environment

  var sandbox, environmentUtil, scopeManager

  exports.initModule = function (sBox) {
    sandbox = sBox
    environmentUtil = sBox.getService(
      'vjs.framework.extension.platform.interface.environment.Environment'
    )
    scopeManager = sBox.getService(
      'vjs.framework.extension.platform.interface.scope.ScopeManager'
    )
  }

  /**
   * 获取上下文路径
   * @returns {String} 上下文路径
   * @example
   * vds.environment.getContextPath();
   * */
  exports.getContextPath = function () {
    return environmentUtil.getContextPath()
  }

  /**
   * 判断当前是否处于移动窗体(废弃，请使用：vds.window.isMobile)
   * @returns {Boolean}
   * @deprecated
   * @example
   * vds.environment.isMobileWindow();
   * */
  exports.isMobileWindow = function () {
    var winScope = scopeManager.getWindowScope()
    if (winScope) {
      if (winScope.getSeries && winScope.getSeries() == 'bootstrap_mobile') {
        return true
      }
    } else if (
      navigator.userAgent &&
      navigator.userAgent.indexOf('ydgApp') != -1
    ) {
      //触发起源不是平台窗体，如第三方页面
      return true
    }
    return false
  }
  /**
   * 解析css
   * @param {String} css css样式
   * @example
   * vds.environment.parseCss(".app{color:red;border:1px solid #e5e5e5;}");
   * */
  exports.parseCss = function (css) {
    if (null != css) {
      environmentUtil.parseCssStr(css)
    }
  }

  module.exports = exports
})
