/**
 * 日志工具方法
 * @desc 提供与日志相关的一系列接口，使用前请先import：vds.import("vds.log.*")
 * @namespace vds/log
 * @module log
 * @catalog 工具方法/日志
 * @example
 * vds.import("vds.log.*");
 * vds.log.warn("打印警告信息！");
 */
import { Log as logUtil } from '@v-act/vjs.framework.extension.util.logutil'

/**
 * 打印日志信息
 * @param {String} msg 日志信息
 * @example
 * vds.log.log("日志信息");
 */
export function log(msg: string) {
  return logUtil.log(msg)
}

/**
 * 打印警告信息
 * @param {String} msg 警告信息
 * @example
 * vds.log.warn("警告日志");
 */
export function warn(msg: string) {
  return logUtil.warn(msg)
}

/**
 * 打印错误信息
 * @param {String} msg 错误信息
 * @example
 * vds.log.error("错误日志");
 */
export function error(msg: string) {
  return logUtil.error(msg)
}
