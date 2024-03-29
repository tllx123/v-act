/**
 * 多语言相关的方法
 * @desc 提供与多语言相关的一系列接口，使用前请先import：vds.import("vds.i18n.*")
 * @namespace vds/i18n
 * @module i18n
 * @catalog 工具方法/多语言
 * @example
 * vds.import("vds.i18n.*");
 * vds.i18n.get("保存");//save
 */

import { Platform as i18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'

/**
 * 获取多语言
 * @param {String} text 语言项文字
 * @param {String} desc 语言项描述
 * @example
 * vds.i18n.get("保存","保存按钮的文字");//save
 * */
export function get(text: string, desc: string) {
  if (typeof text == 'string') {
    //兼容处理，二次开发脚本未被解析成多语言格式
    return text
  }
  var service = i18n //定义变量是防止被解析，应该解析二次开发的脚本生成多语言格式，此方法只是作为中转而已。
  if (service) {
    service.get(text, desc)
  }
}
