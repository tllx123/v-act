import * as jsonUtil from 'module'
import * as viewContext from 'module'
import * as viewOperation from 'module'

// 加载


//主入口(必须有)
const main = function (ip:string, port:string) {
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
