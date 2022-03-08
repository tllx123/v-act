import * as operationLib from 'module'
import * as viewContext from 'module'

/**
 * 主入口
 * @param ids
 * @param isReaded true:已读/false:未读
 */
const main = function (ids, isReaded) {
  if (ids == null || ids == '')
    throw new Error(
      'UpdateMessageDetailRead函数,id值不能为空，请检查(多个id以英文逗号分割)'
    )
  if (isReaded == null || isReaded == '')
    throw new Error('UpdateMessageDetailRead函数,是否为已读值不能为空，请检查')

  let expression = 'UpdateMessageDetailRead("' + ids + '","' + isReaded + '")'
  let result = operationLib.executeFormulaExpression(
    viewContext.getModuleId(),
    expression
  )
  if (result && result.success == true) {
    let errorMsg = result.data.result
    if (errorMsg == null || errorMsg == '') return ''
    else return 'UpdateMessageDetailRead函数执行失败：' + errorMsg
  } else {
    return 'UpdateMessageDetailRead函数执行失败：' + result['msg']
  }
}

export { main }
