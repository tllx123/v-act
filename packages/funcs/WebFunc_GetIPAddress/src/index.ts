import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
/**
 * GetIPAddress 返回当前客户端的IP地址（注意返回的是服务器端获取到的请求IP地址） 代码示例:GetIPAddress() 返回值为当前在线的IP地址 无参数 返回类型：字符串
 */
import * as rpc from '@v-act/vjs.framework.extension.platform.services.integration.vds.rpc'

const vds = { rpc, exception }

const main = function () {
  try {
    var expression = 'GetIPAddressFunc()'
    var findParam = {
      expression: expression
    }
    var result
    vds.rpc.callCommandSync('WebExecuteFormulaExpression', null, {
      isOperation: true,
      operationParam: findParam,
      success: function (rs: any) {
        result = rs.data.result
      }
    })
    return result
  } catch (e) {
    throw vds.exception.newConfigException('函数执行失败')
  }
}
export { main }
