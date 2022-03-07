import { WindowRuntimeInit as windowInit } from '@v-act/vjs.framework.extension.platform.init.view'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

export function initModule(sb) {
  exports.Events['OnBindRule'] = windowInit.Events.onBindRule
  exports.Events['BeforeDataLoad'] = windowInit.Events.beforeDataLoad
  exports.Events['AfterDataLoad'] = windowInit.Events.afterDataLoad
  exports.Events['OnMultiRequest'] = windowInit.Events.onMultiRequest
  exports.Events['OnDataLoad'] = windowInit.Events.onDataLoad
  exports.Events['OnDataInitLoad'] = windowInit.Events.dataInitLoad
  exports.Events['WindowLoaded'] = windowInit.Events.windowLoaded
  exports.Events['WindowInited'] = windowInit.Events.windowInited
}

const registerHandler = function (params) {
  let scope = scopeManager.getScope()
  let componentCode = scope.getComponentCode(),
    windowCode = scope.getWindowCode()
  let p = {
    componentCode: componentCode,
    windowCode: windowCode,
    eventName: params.eventName,
    handler: params.handler
  }
  windowInit.registerHandler(p)
}

const registerWindowOperation = function (params) {
  windowInit.registerVariableHandler(params)
}

/**
 * 事件名称枚举
 * @enum {String}
 * @property {String} OnBindRule  规则绑定
 * @property {String} OnDataLoad  数据加载
 * @property {String} OnDataInitLoad  数据初始化
 * @property {String} OnMultiRequest  批量请求
 * @property {String} WindowInited  窗体初始化完成
 */
exports.Events = {}

export { initComponent, registerHandler, registerWindowOperation }
