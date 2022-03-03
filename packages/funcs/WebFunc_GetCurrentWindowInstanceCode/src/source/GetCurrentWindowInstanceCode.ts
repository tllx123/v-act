import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
let undefined

exports.initModule = function (sb) {}

let main = function (param) {
  let currentWindowInstanceCode = scopeManager.getCurrentScopeId()
  return currentWindowInstanceCode ? currentWindowInstanceCode : null
}

export { main }
