import * as operationLib from 'module'
import * as viewContext from 'module'

export function initModule() {}
/**
 * 主入口
 * @param messageCategoryId 数据源名称
 */
const main = function (messageCategoryId) {
  // 如果树结构未定义，即不是树结构，那么动态加载条件不适用
  if (messageCategoryId == null || messageCategoryId == '') {
    throw new Error('待发布的消息分类id不能为空，请检查')
  }

  let expression = 'DeployMessageService("' + messageCategoryId + '")'
  let result = operationLib.executeFormulaExpression(
    viewContext.getModuleId(),
    expression
  )
  if (result && result.success == true) {
    let errorMsg = result.data.result
    if (errorMsg == null || errorMsg == '') return ''
    else return 'DeployMessageService函数发布消息服务失败：' + errorMsg
  } else {
    return 'DeployMessageService函数发布消息服务失败：' + result['msg']
  }
}

export { main }
