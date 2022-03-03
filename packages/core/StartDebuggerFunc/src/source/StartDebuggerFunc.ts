import * as viewContext from 'module'
import * as viewOperation from 'module'
import * as jsonUtil from 'module'

// 加载
let undefined
let undefined
let undefined
exports.initModule = function () {}
//主入口(必须有)
let main = function (ip, port) {
  try {
    let expression = 'StartDebuggerFunc("' + ip + '","' + port + '")'
    let findParam = {
      expression: expression
    }
    let paramData = jsonUtil.obj2json(findParam)
    let rtObj = viewOperation.doRequest(
      viewContext.getModuleId(),
      'WebExecuteFormulaExpression',
      paramData,
      true,
      true
    )
  } catch (e) {
    throw new Error('函数执行失败')
  }
}

export { main }
