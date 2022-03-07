import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { WindowContainerManager as windowContainerManager } from '@v-act/vjs.framework.extension.platform.services.view.relation'

export function initModule(sb) {}

const main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    newTitle = argsLen >= 1 ? args[0] : null
  if (newTitle == null) return
  let scopeId = scopeManager.getCurrentScopeId()
  windowContainerManager.updateTitleByScopeId(scopeId, newTitle)
}

export { main }
