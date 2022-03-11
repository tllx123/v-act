import * as operationLib from 'module'
import * as viewContext from 'module'

//加载

//主入口(必须有)
const main = function (fileID: string) {
  if (!fileID) return ''
  // 执行后台函数，调用后台函数
  let expression = 'GetFileContent("' + fileID + '")'
  //@ts-ignore
  let expResult = operationLib.executeFormulaExpression(
    //@ts-ignore
    viewContext.getModuleId(),
    expression
  )
  if (expResult && expResult.data.result) {
    let success = expResult.data.result.success
    if ((success + '').toLowerCase() == 'true') {
      //data中的内容为规则返回值内容
      let data = expResult.data.result
      //msg属性为true则认为能够提交任务
      if (data) {
        return data['msg']
      }
    }
  }

  return null
}
export { main }
