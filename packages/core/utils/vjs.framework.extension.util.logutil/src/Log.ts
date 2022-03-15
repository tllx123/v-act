/**
 * @namespace Log
 * @module Log
 * @desc 日志记录
 *   vjs名称：vjs.framework.extension.util.log
 *  vjs服务名称：vjs.framework.extension.util.log
 * @example
 * 		使用前,请在vjs配置文件中添加对vjs.framework.extension.util.log模块依赖
 * 		const log = sandbox.getService("vjs.framework.extension.util.log");
 * 		log.log("hello world！");
 * 		......
 */

import { ScopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

let _logCache: any

let _disabled: boolean = false

const getLogger = function () {
  /*if (!_logCache) {
    const series = ScopeManager.getProperty('type')
    if (series) {
      // @ts-ignore
      _logCache = sandbox.getService('vjs.framework.extension.util.log', {
        type: series
      })
      // @ts-ignore
      _logCache = _logCache || sandbox.logger
    } else {
      // @ts-ignore
      _logCache = sandbox.logger
    }
  }
  return _logCache*/
  if (typeof window != 'undefined') {
    return window.console
  }
  return null
}

const isEnable = function () {
  return !_disabled
}

export function showLogConsole() {
  if (isEnable()) {
    const logger = getLogger()
    if (logger && logger.showLogConsole) {
      logger.showLogConsole()
    }
  }
}

/**
 * 禁用日志
 */
export function disable() {
  _disabled = true
}

/**
 * 启用日志
 */
export function enable() {
  _disabled = false
}

/**
 *  记录调试信息
 * @param {String} msg 信息内容
 */
export function debug(msg: string) {
  try {
    if (isEnable()) {
      const logger = getLogger()
      logger && logger.log(msg)
    }
  } catch (e) {} //微信公众号中会报死循环，不要问为什么，我也不知道
}

/**
 *  记录日志
 * @param {String} msg 信息内容
 */
export const log = (msg: string) => debug(msg)

/**
 *  记录警告信息
 * @param {String} msg 信息内容
 */
export function warn(msg: string) {
  try {
    if (isEnable()) {
      const logger = getLogger()
      logger && logger.warn(msg)
    }
  } catch (e) {} //微信公众号中会报死循环，不要问为什么，我也不知道
}

/**
 *  记录错误信息
 * @param {String} msg 信息内容
 */
export function error(msg: string) {
  try {
    if (isEnable()) {
      const logger = getLogger()
      logger && logger.error(msg)
    }
  } catch (e) {} //微信公众号中会报死循环，不要问为什么，我也不知道
}
