/**
 * web设计器配置数据标识实现
 * */

import { WindowInfo as windowInfo } from '@v-act/vjs.framework.extension.platform.data.manager.runtime.info'
import { ConfigDataUtil as configDataUtil } from '@v-act/vjs.framework.extension.platform.util.config.data'

/**
 * web版设计器配置数据标识
 * */
export function getCode() {
  return 'WebDesign'
}
/**
 * 获取条件key列表
 * 请求时，取到上下文key后，从此接口筛选哪些key作为条件
 * */
export function getConditionKeys() {
  return [
    configDataUtil.KEYS.COMPONENTCODE,
    configDataUtil.KEYS.WINDOWCODE,
    'frameworkComponentCode',
    'frameworkInstanceCode'
  ]
}
/**
 * 处理数据
 * @param	datas
 * @param	condition	请求数据时使用的条件
 * @param	missPermData	是否忽略权限配置
 * */
export function handleData(datas, condition, missPermData) {
  if (!datas && datas.length > 0) {
    return
  }
  var componentCode = condition[configDataUtil.KEYS.COMPONENTCODE]
  var windowCode = condition[configDataUtil.KEYS.WINDOWCODE]
  var data = datas[0]
  if (
    !missPermData &&
    !windowInfo.isWindowPermissionInited(componentCode, windowCode) &&
    data.hasOwnProperty('hasPermiss')
  ) {
    windowInfo.markWindowPermission(
      componentCode,
      windowCode,
      data['hasPermiss']
    )
  }
  var configDatas = data['webDesign']
  if (configDatas) {
    for (var i = 0, len = configDatas.length; i < len; i++) {
      var configData = configDatas[i]
      configDataUtil.put(exports.getCode(), configData, condition)
    }
  }
}
