import {
  component as i18n_component,
  window as i18n_window
} from '@v-act/vjs.framework.extension.platform.interface.i18n'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

let sandbox
//初始化vjs模块，如果函数逻辑需要引用相关vjs服务，则初始化相关vjs模块；如果不需要初始化逻辑可以为空
export function initModule(sb) {
  //sb：前台vjs的沙箱（容器/上下文），可以用它根据vjs名称，获取到相应vjs服务
  sandbox = sb
}

//主入口(必须有)
const main = function (param) {
  let args = param.args
  let key = args[0]
  let defaultVal = args[1]
  let scopeId = scopeManager.getCurrentScopeId()
  let scope = scopeManager.getScope(scopeId)
  let params
  if (scopeManager.isComponentScope(scopeId)) {
    params = {
      componentCode: scope.getComponentCode(),
      code: key,
      defaultVal: defaultVal
    }
    if (i18n_component.hasExpLanguage(params)) {
      return i18n_component.getExpLanguage(params)
    }
  } else {
    params = {
      componentCode: scope.getComponentCode(),
      windowCode: scope.getWindowCode(),
      code: key,
      defaultVal: defaultVal
    }
    if (i18n_window.hasExpLanguage(params)) {
      return i18n_window.getExpLanguage(params)
    }
  }
  return defaultVal
}
export { main }
