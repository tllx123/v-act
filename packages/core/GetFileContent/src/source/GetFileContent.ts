import * as viewModel from 'module'
import { EasyTemplateUtil as easyTemplateUtil } from '@v-act/vjs.framework.extension.util'
import * as formulaUtil from 'module'
import * as operationLib from 'module'
import * as viewContext from 'module'
//加载
let undefined
let undefined
let undefined
let undefined
let undefined

exports.initModule = function (sBox) {}

//主入口(必须有)
let main = function (fileID) {
  if (!fileID) return ''
  // 执行后台函数，调用后台函数
  let expression = 'GetFileContent("' + fileID + '")'
  let expResult = operationLib.executeFormulaExpression(
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
