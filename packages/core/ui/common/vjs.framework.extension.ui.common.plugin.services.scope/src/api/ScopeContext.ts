import { ScopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

/**
 * 从线程变量获取窗体唯一标识
 */
let getWindowCode = function () {
  return ScopeManager.getProperty('windowCode')
}

/**
 * 从线程变量获取构件唯一标识
 */
let getComponentCode = function () {
  return ScopeManager.getProperty('componentCode')
}

export { getComponentCode, getWindowCode }
