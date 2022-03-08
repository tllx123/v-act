/**
 *
 *
 */
import * as window from '@v-act/vjs.framework.extension.platform.services.integration.vds.window'
const vds = { window }

const main = function (param) {
  //		var currentWindowInstanceCode = scopeManager.getCurrentScopeId();//客户端方法里面执行会取到构件域
  //		return currentWindowInstanceCode ? currentWindowInstanceCode : null;

  return vds.window.getInstanceId()
}
export { main }
