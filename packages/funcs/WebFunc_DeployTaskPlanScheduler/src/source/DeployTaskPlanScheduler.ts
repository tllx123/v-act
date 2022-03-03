import * as log from 'module'
import * as viewModel from 'module'
import * as viewContext from 'module'
import * as operationLib from 'module'
let undefined
let undefined
let undefined
let undefined

exports.initModule = function () {}
/**
 * 主入口
 * @param schedulerIds 计划任务id(逗号分割)
 * @param isDelete 是否删除计划任务
 */
let main = function (schedulerIds, isDelete) {
  if (schedulerIds == null || schedulerIds == '') {
    throw new Error('待发布的计划任务id不能为空，请检查')
  }
  let isDel = true == isDelete || 'true' == isDelete
  let expression =
    'DeployTaskPlanScheduler("' + schedulerIds + '",' + isDel + ')'
  let result = operationLib.executeFormulaExpression(
    viewContext.getModuleId(),
    expression
  )
  if (result && result.success == true) {
    let errorMsg = result.data.result
    if (errorMsg == null || errorMsg == '') return ''
    else return 'DeployTaskPlanScheduler函数发布计划任务失败：' + errorMsg
  } else {
    return 'DeployTaskPlanScheduler函数发布计划任务失败：' + result['msg']
  }
}

export { main }
