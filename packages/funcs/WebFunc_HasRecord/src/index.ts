/**
 * 检查是组件否有值 代码示例:HasRecord('Contract')返回值布尔类型 参数数量:1 参数1--表名(文本类型)
 * 返回值记录数,如果为-1则表示无表或查询出错
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as rpc from '@v-act/vjs.framework.extension.platform.services.integration.vds.rpc'
const vds = { object, exception, rpc }

const main = function (dsName) {
  if (vds.object.isUndefOrNull(dsName))
    throw vds.exception.newConfigException('传入表名为空，请检查')

  try {
    return executeExpression(dsName)
  } catch (e) {
    throw vds.exception.newConfigException('函数执行失败')
  }
}
export { main }

var executeExpression = function (dsName) {
  var expression = 'WebFunc_HasRecord("' + dsName + '")'
  var findParam = {
    expression: expression
  }

  var result
  vds.rpc.callCommandSync('WebExecuteFormulaExpression', null, {
    isOperation: true,
    operationParam: findParam,
    success: function (rs) {
      result = rs
    }
  })

  if (result.success) return result.data.result
  else throw vds.exception.newConfigException('执行表达式错误.')
}
