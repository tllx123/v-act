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

import { Environment as environmentUtil } from '@v-act/vjs.framework.extension.platform.interface.environment'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

/**
 * 获取上下文路径
 * @returns {String} 上下文路径
 * @example
 * vds.environment.getContextPath();
 * */
export function getContextPath() {
  return environmentUtil.getContextPath()
}

/**
 * 判断当前是否处于移动窗体(废弃，请使用：vds.window.isMobile)
 * @returns {Boolean}
 * @deprecated
 * @example
 * vds.environment.isMobileWindow();
 * */
export function isMobileWindow() {
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
export function parseCss(css: string | null) {
  if (null != css) {
    environmentUtil.parseCssStr(css)
  }
}

module.exports = exports
