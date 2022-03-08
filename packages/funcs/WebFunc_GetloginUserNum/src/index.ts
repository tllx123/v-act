/**
 * GetloginUserNum 返回当前的在线用户数(实时获取) 代码示例:GetloginUserNum() 返回值为当前在线的用户数 无参数 返回值为数值
 */
var main = function (param) {
  try {
    var expression = 'GetloginUserNum()'
    var findParam = {
      expression: expression
    }
    var scope = scopeManager.getWindowScope()
    var windowCode = scope ? scope.getWindowCode() : ''
    var result

    operation.request({
      windowCode: windowCode,
      operation: 'WebExecuteFormulaExpression',
      isAsync: false,
      params: findParam,
      success: function (rs) {
        result = rs.data.result
      }
    })

    return result * 1
  } catch (e) {
    throw new Error('函数执行失败')
  }
}
export { main }
