import { Environment as environment } from '@v-act/vjs.framework.extension.platform.interface.environment'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

export function initModule(sb) {}

const main = function (param) {
  let args = param.getArgs()
  let loginParams = {}
  if (args.length < 1) {
    let windowScope = scopeManager.getWindowScope()
    loginParams.type = 'platform'
    loginParams.componentCode = windowScope.getComponentCode()
    loginParams.windowCode = windowScope.getWindowCode()
  } else {
    let type = args[0]
    if (type == 'platform') {
      loginParams.type = type
      loginParams.componentCode = args[1]
      loginParams.windowCode = args[2]
    } else if (type == 'url') {
      loginParams.type = type
      loginParams.url = args[1]
    }
  }
  environment.setLoginInfo(loginParams)
}

export { main }
