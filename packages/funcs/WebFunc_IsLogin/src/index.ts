/**
 * 判断当前用户是否已登录：IsLogin() 当前用户已登录、并且当前会话有效（未过期），返回true；否则，返回false
 */
import * as rpc from '@v-act/vjs.framework.extension.platform.services.integration.vds.rpc'
const vds = { rpc }

var main = function (param) {
  var result = false
  vds.rpc.callCommandSync('IsLoginExpression', null, {
    isOperation: true,
    operationParam: [
      {
        paramName: 'InParams',
        paramType: 'char',
        paramValue: null
      }
    ],
    success: function (rs) {
      result = rs
    }
  })
  if (result.data && result.data.id) return true
  else return false
}
export { main }
