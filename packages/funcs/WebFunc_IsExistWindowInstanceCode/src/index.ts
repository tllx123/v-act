/**
 *
 *
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as window from '@v-act/vjs.framework.extension.platform.services.integration.vds.window'
const vds = { object, exception, window }

var main = function (scopeId) {
  var FUNCNAME = '前台函数[IsExistWindowInstanceCode]-'
  //获取函数传入的参数
  var _result = false
  //if(!CheckParamNum(FUNCNAME,args,1)) return false;
  if (vds.object.isUndefOrNull(scopeId)) {
    throw vds.exception.newConfigException(
      FUNCNAME + '第一个参数为空,请检查配置！'
    )
    return false
  }

  if (vds.window.exist(scopeId)) {
    _result = true
  }
  return _result
}
export { main }
