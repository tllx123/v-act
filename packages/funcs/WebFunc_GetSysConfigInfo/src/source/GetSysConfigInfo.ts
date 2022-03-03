import * as viewContext from 'module'
import * as jsonUtil from 'module'
import * as viewOperation from 'module'

//加载viewContext模块
let undefined
//加载jsonUtil模块
let undefined
let undefined

exports.initModule = function () {}

/**
 * 主入口
 */
let main = function (key) {
  // 构造参数
  let expression = 'GetSysConfigInfoFunc("' + key + '")'

  let findParam = {
    expression: expression
  }
  let paramData = jsonUtil.obj2json(findParam)
  let rtObj = viewOperation.doRequest(
    viewContext.getModuleId(),
    'WebExecuteFormulaExpression',
    paramData
  )
  if (rtObj.success && rtObj.data.result != '-1') {
    return rtObj.data.result
  } else {
    throw new Error(
      '执行系统配置信息页面函数：GetSysConfigInfo错误，请联系管理员处理！'
    )
  }
}

export { main }
