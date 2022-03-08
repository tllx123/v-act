import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

export function initModule(sb) {}

const main = function (param) {
  let currentWindowInstanceCode = scopeManager.getCurrentScopeId()
  return currentWindowInstanceCode ? currentWindowInstanceCode : null
}

export { main }
