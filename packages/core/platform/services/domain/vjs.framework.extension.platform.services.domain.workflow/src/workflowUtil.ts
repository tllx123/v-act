import * as formulaUtil from 'module'
import * as log from 'module'
import * as operationLib from 'module'
import * as systemConstant from 'module'
import * as viewContext from 'module'
import * as viewModel from 'module'
import * as viewOperation from 'module'

import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

export function initModule(sBox) {}

//流程图XML所在字段名
let __processGraphXmlField__ = 'ProcessGraphXml'
//流程定义XML所在字段名
let __processDefinitionXmlField__ = 'ProcessDefinitionXml'
//流程定义ID字段名
let __ProcessDefinitionIdField__ = 'ProcessDefinitionId'
// 流程实例ID字段名
let __ProcessInstanceIdField__ = 'ProcessInstanceId'
// 流程任务ID字段名
let __ProcessTaskIdField__ = 'ProcessTaskId'
// 流程ID
let __ProcessId__ = 'ProcessId'

/**
 * 获取流程图XML字段名
 * @return 流程图XMl所在字段名
 */
let getProcessGraphXmlField = function () {
  return __processGraphXmlField__
}

/**
 * 获取流程定义XML字段名
 * @return 流程定义XML所在字段名
 */
let getProcessDefinitionXmlField = function () {
  return __processDefinitionXmlField__
}

/**
 * 获取流程实例ID字段名
 * @return 流程实例ID所在字段名
 */
let getProcessInstanceIdField = function () {
  return __ProcessInstanceIdField__
}

/**
 * 获取流程定义ID字段名
 * @return 流程定义ID所在字段名
 */
let getProcessDefinitionIdField = function () {
  return __ProcessDefinitionIdField__
}

/**
 * 获取流程任务ID字段名
 * @return 流程任务ID所在字段名
 */
let getProcessTaskIdField = function () {
  return __ProcessTaskIdField__
}

/**
 * 获取流程ID字段名
 */
let getProcessIdField = function () {
  return __ProcessId__
}

/**
 * 生成下一步执行单元ID列表
 * @param nextActivityIds 下一步执行环节ID列表
 * @param outputRecords 选择下一步执行单元组件返回结果集
 * @return {string} nextExecutionUnitIds 下一步执行单元ID列表
 */
let generateNextExecutionUnitIds = function (nextActivityIds, outputRecords) {
  let ID_SPLIT_MARK = ';'
  let ARRAY_SPLIT_MARK = '||'
  // 执行单元所属环节ID
  let ACTIVITY_ID_FIELD = 'ActivityId'
  // 执行单元ID
  let EXECUTION_UNIT_VALUE_FIELD = 'ExecutionUnitValue'
  // 执行单元顺序
  let SORT_NO_FIELD = 'SortNo'
  // 是否开始环节标识
  let ACTIVITY_IS_START_FIELD = 'IsStartActivity'
  // 是否结束环节标识
  let ACTIVITY_IS_END_FIELD = 'IsEndActivity'
  // 是否单人执行标识
  let ACTIVITY_IS_ONLY_ONE_EXE_FIELD = 'IsOnlyOneExeUnit'

  // 环节id对应属性执行单元对象列表
  let activityMap = {}
  // 环节其他属性map，key为activityId
  let activityAttributesMap = {}
  let nextExecutionUnitIds = ''
  let nextActivityIds = ''

  //如果没有返回记录则直接输出空数组
  if (outputRecords == null || outputRecords.length < 0) {
    return {
      nextExecutionUnitIds: '',
      nextActivityIds: ''
    }
  }

  //遍历子窗体返回的数据内容
  for (let recordIndex = 0; recordIndex < outputRecords.length; recordIndex++) {
    let record = outputRecords[recordIndex]
    if (typeof record[ACTIVITY_ID_FIELD] == 'undefined') {
      throw new Error(
        '[workflowUtil.generateNextExecutionUnitIds]选择审核人组件返回记录字段必须包含' +
          ACTIVITY_ID_FIELD +
          '(注意大小写匹配)'
      )
    }

    if (typeof record[EXECUTION_UNIT_VALUE_FIELD] == 'undefined') {
      throw new Error(
        '[workflowUtil.generateNextExecutionUnitIds]选择审核人组件返回记录字段必须包含' +
          EXECUTION_UNIT_VALUE_FIELD +
          '(注意大小写匹配)'
      )
    }

    let activityId = record[ACTIVITY_ID_FIELD]
    let executionUnitId = record[EXECUTION_UNIT_VALUE_FIELD]
    let executionUnitSortNo = record[SORT_NO_FIELD]
    let executionUnitObj = {}
    executionUnitObj[ACTIVITY_ID_FIELD] = activityId
    executionUnitObj[EXECUTION_UNIT_VALUE_FIELD] = executionUnitId
    // sortNo字段不存在时，使用0作为默认
    executionUnitObj[SORT_NO_FIELD] =
      typeof executionUnitSortNo != 'undefined' ? executionUnitSortNo : '0'

    //一个活动ID创建一份集合,集合里面存放同一个活动ID的所有活动执行人id数据
    if (!activityMap[activityId]) {
      activityMap[activityId] = []
    }
    activityMap[activityId].push(executionUnitObj)

    // 构建环节其他属性map
    if (typeof activityAttributesMap[activityId] == 'undefined') {
      activityAttributesMap[activityId] = {}
      activityAttributesMap[activityId][ACTIVITY_IS_START_FIELD] =
        record[ACTIVITY_IS_START_FIELD]
      activityAttributesMap[activityId][ACTIVITY_IS_END_FIELD] =
        record[ACTIVITY_IS_END_FIELD]
      activityAttributesMap[activityId][ACTIVITY_IS_ONLY_ONE_EXE_FIELD] =
        record[ACTIVITY_IS_ONLY_ONE_EXE_FIELD]
    }
  }

  let sortNoMark = SORT_NO_FIELD

  //遍历活动ID够早的集合内容
  for (let activityId in activityMap) {
    let executionUnitObjArr = activityMap[activityId]
    if (!executionUnitObjArr || executionUnitObjArr.length <= 0) {
      continue
    }

    // 按照sortNo进行排序
    executionUnitObjArr.sort(function (preExecution, curExecution) {
      let mark = '0000000000'
      let compareField = sortNoMark
      let compareLength = 5
      if (
        typeof preExecution[compareField] != 'undefined' &&
        typeof curExecution[compareField] != 'undefined'
      ) {
        if (
          preExecution[compareField] == null ||
          preExecution[compareField] == undefined
        ) {
          preExecution[compareField] = 0
        }
        if (
          curExecution[compareField] == null ||
          curExecution[compareField] == undefined
        ) {
          curExecution[compareField] = 0
        }
        let num1 = mark + preExecution[compareField]
        let num2 = mark + curExecution[compareField]
        let strNum1 = num1.substring(num1.length - compareLength)
        let strNum2 = num2.substring(num2.length - compareLength)
        if (strNum1 > strNum2) {
          return 1
        } else if (strNum1 === strNum2) {
          return 0
        }
        return -1
      }
      return 1
    })

    //当前活动ID的执行人ID列表
    let thisActivityExeUnitIds = ''
    //收集当前活动ID的所有执行人ID列表
    for (let index = 0; index < executionUnitObjArr.length; index++) {
      let executionUnitObj = executionUnitObjArr[index]
      let exeUnitId = executionUnitObj[EXECUTION_UNIT_VALUE_FIELD]
      if ('BackToStartActivity' == exeUnitId) {
        // 如果标识为返回开始，则不进行收集
        continue
      }
      thisActivityExeUnitIds +=
        thisActivityExeUnitIds == '' ? exeUnitId : ID_SPLIT_MARK + exeUnitId
    }

    //收集所有下一步活动ID列表
    nextActivityIds +=
      nextActivityIds == '' ? activityId : ID_SPLIT_MARK + activityId

    //收集所有活动ID下的执行人ID列表
    nextExecutionUnitIds +=
      nextExecutionUnitIds == ''
        ? thisActivityExeUnitIds
        : ARRAY_SPLIT_MARK + thisActivityExeUnitIds
  }

  return {
    nextExecutionUnitIds: nextExecutionUnitIds,
    nextActivityIds: nextActivityIds,
    nextActivityAttributes: activityAttributesMap
  }
}

/**
 * 获取选择下一步执行单元组件ID，单独方法预留支持动态组件ID情况
 * @param componentId 组件ID
 * @return
 */
let getComponentId = function (componentId) {
  return componentId
}

/**
 * 构建流程变量，目前认为所有值都是表达式配置
 * @param mappingItems 流程变量值配置对象
 * @param dynamicMappingItems 动态流程变量值配置对象
 */
let getProcessVariables = function (mappingItems, dynamicMappingItems) {
  let variable = {}
  if (mappingItems) {
    for (let i = 0; i < mappingItems.length; i++) {
      let variableName = mappingItems[i]['VariableName']
      let variableValueExpression = mappingItems[i]['VariableValue']
      let variableValue = formulaUtil.evalExpression(variableValueExpression)
      variable[variableName] = variableValue
    }
  }
  // 设置动态变量
  if (dynamicMappingItems) {
    let tableName = dynamicMappingItems['VariableSrcTableName']
    let nameField = dynamicMappingItems['VariableNameFieldName']
    let valueField = dynamicMappingItems['VariableValueFieldName']
    let typeField = dynamicMappingItems['VariableTypeFieldName']
    let variantMap = getDymanicProcessVariant(
      tableName,
      nameField,
      valueField,
      typeField
    )
    if (variantMap) {
      for (let key in variantMap) {
        variable[key] = variantMap[key]
      }
    }
  }
  return variable
}

/**
 * 打开指定组件，并返回记录
 * @param {Object} openComponentId 目标组件ID
 * @param {Object} componentVariableMapping 传递组件变量配置map
 */
let getRecordsFromOpenModule = function (
  openComponentId,
  componentVariableMapping
) {
  // 获取组件ID、高宽及标题
  let properties = systemConstant.getSystemConstant('componentProperties', [
    openComponentId
  ])
  if (
    typeof properties['Width'] == 'undefined' ||
    typeof properties['Height'] == 'undefined'
  ) {
    throw new Error('目标组件不存在或未进行发布，无法打开')
  }
  let width = properties['Width']
  let height = properties['Height']
  let title = properties['ComponentName']

  // 构建打开组件传递的变量及控制标识参数
  let componentVariable = {}
  componentVariable['variable'] = {}
  componentVariable['variable']['multiChoose'] = true
  componentVariable['variable']['isReturnValue'] = true
  componentVariable['variable']['formulaOpenMode'] = 'retrunValues'
  if (componentVariableMapping) {
    for (let key in componentVariableMapping) {
      componentVariable['variable'][key] = componentVariableMapping[key]
    }
  }

  let outputObject = viewModel
    .getCmpModule()
    .callModuleEx(
      openComponentId,
      title,
      componentVariable,
      width,
      height,
      true
    )
  if (!outputObject || typeof outputObject.values == 'undefined') {
    return null
  }
  return outputObject.values
}

/**
 * 打开指定组件，并返回记录异步操作
 * @param {Object} openComponentId 目标组件ID
 * @param {Object} componentVariableMapping 传递组件变量配置map
 * @param {Object} ruleContext 规则上下文对象
 * @param {Object} callback 回调方法
 */
let getRecordsFromOpenModuleAsync = function (
  openComponentId,
  componentVariableMapping,
  ruleContext,
  callback
) {
  // 获取组件ID、高宽及标题
  let properties = systemConstant.getSystemConstant('componentProperties', [
    openComponentId
  ])
  if (
    typeof properties['Width'] == 'undefined' ||
    typeof properties['Height'] == 'undefined'
  ) {
    throw new Error('目标组件不存在或未进行发布，无法打开')
  }
  let width = properties['Width']
  let height = properties['Height']
  let title = properties['ComponentName']
  // 构建打开组件传递的变量及控制标识参数
  let componentVariable = {}
  componentVariable['variable'] = {}
  componentVariable['variable']['multiChoose'] = true
  componentVariable['variable']['isReturnValue'] = true
  componentVariable['variable']['formulaOpenMode'] = 'retrunValues'
  if (componentVariableMapping) {
    for (let key in componentVariableMapping) {
      componentVariable['variable'][key] = componentVariableMapping[key]
    }
  }
  // 标注打开方式为模态窗口dialog，目前认为相同的componentId已打开则在该窗口重刷
  let callBackFunc = function (outputObject) {
    if (outputObject && typeof callback == 'function') {
      callback(outputObject)
    }
    ruleContext.fireRuleCallback()
  }
  ruleContext.setRuleCallbackFireFlag(true)
  viewModel
    .getCmpModule()
    .callModalModule(
      openComponentId,
      title,
      width,
      height,
      componentVariable,
      callBackFunc
    )
}

/**
 * 后台服务获取下一环节ID列表
 * @description 注意后台规则必须存在command参数为getNextActivitys时的实现
 * @param ruleInstId 规则实例ID
 * @param processDefinitionId 流程定义ID
 * @param processInstanceId 流程实例ID
 * @param taskId 流程任务ID,为空时获取流程首个人工活动环节ID列表
 * @param variables 流程变量map
 * @return nextActicityIds 下一环节ID列表
 */
let getNextActivityInfo = function (
  ruleInstId,
  processDefinitionId,
  processInstanceId,
  taskId,
  variables
) {
  // 构建后台规则参数
  let inParamsObj = {}
  inParamsObj.moduleId = viewContext.getModuleId()
  inParamsObj.command = 'getNextActivitys'
  inParamsObj.processDefinitionId = processDefinitionId
    ? processDefinitionId
    : ''
  inParamsObj.processInstanceId = processInstanceId ? processInstanceId : ''
  inParamsObj.taskId = taskId ? taskId : ''
  inParamsObj.variables = variables

  // 后台规则获取数据
  let result = operationLib.executeRule(
    viewContext.getModuleId(),
    ruleInstId,
    inParamsObj
  )
  if (result.success != true) {
    log.error(result.errorMsg)
    throw new Error('[workflowUtil.getNextActivityIds]启动流程失败')
  }
  return result.data
}

/**
 * 从nextActivityObjs中提取activityId列表
 * @param nextActivityObjs 下一环节对象列表
 */
let getNextActivityIds = function (nextActivityObjs) {
  let nextActivityIds = ''
  if (nextActivityObjs && nextActivityObjs.length > 0) {
    for (let i = 0; i < nextActivityObjs.length; i++) {
      let nextActivityObj = nextActivityObjs[i]
      let activityId = nextActivityObj.id
      nextActivityIds += (i > 0 ? ';' : '') + activityId
    }
  }
  return nextActivityIds
}

/**
 * 获取下一环节列表中是否包含启动节点
 * TODO: 暂时严格点，如果其中有一个环节包含开始就认为不需要选择审核人了
 * @param nextActivityObjs 下一环节对象列表
 */
let getNextActivityIsStart = function (nextActivityObjs) {
  let isStart = false
  // liangmf 2013-02-07 修改为，上一环节列表只有一个，并且是开始节点的时候，才是包含启动节点
  if (nextActivityObjs && nextActivityObjs.length == 1) {
    if (nextActivityObjs[0].isStart == true) {
      isStart = true
    }
  }
  return isStart
}

/**
 * 获取下一环节列表是否包含结束节点
 * TODO: 暂时严格点，如果其中有一个环节包含开始就认为不需要选择审核人了
 * @param nextActivityObjs 下一环节对象列表
 */
let getNextActivityIsEnd = function (nextActivityObjs) {
  let isEnd = false
  // liangmf 2013-03-26 修改为，下一环节列表只有一个，并且是结束节点时候，才是包含结束节点
  if (nextActivityObjs && nextActivityObjs.length == 1) {
    if (nextActivityObjs[0].isEnd == true) {
      isEnd = true
    }
  }
  return isEnd
}

/**
 * 运行规则对应后台规则
 * @param {Object} ruleInstId 规则实例ID
 * @param {Object} params 规则运行参数
 * @param {function} callback 后台规则运行后执行回调
 * @description
 * 参数params参考以下配置:
 * ruleInstId 规则实例ID
 * processDefinitionId  流程定义ID（不允许为空）
 * processInstanceId    流程实例ID（允许为空,也允许外界指定但必须为uuid）
 * nextActivityIds  下一步活动id列表   (多个下一步活动id用分号分隔)
 * 例如:"01;02;03"
 * nextExecutionUnitIds 下一步执行者单元id列表 (一个下一步活动的执行者单元id用分号分隔，多个下一步活动之间用||分隔)
 * 例如:"1001;1002;1003||2001;2002;2003||3001;3002;3003"
 *      id为01活动对应的执行者单元id有1001;1002;1003
 *      id为02活动对应的执行者单元id有2001;2002;2003
 *      id为03活动对应的执行者单元id有3001;3002;3003
 * variables 流程变量
 * 例如:{"variable1":"变量值1","variable2":"变量值2"}
 */
let processOperation = function (ruleInstId, params, callback) {
  // 后台规则获取数据
  operationLib.executeRuleAsyn(viewContext.getModuleId(), ruleInstId, params)
  if (typeof callback == 'function') {
    callback(null)
  }
  return true
}

/**
 * 是否已经部署了流程定义
 * @param {Object} processDefinitionId 流程定义ID
 * @param {Object} processInstanceId 流程实例ID (传了流程实例ID，流程定义ID和任务ID可以不传)
 * @param {Object} taskId 任务ID (传了任务ID，流程定义ID和流程实例ID可以不传)
 */
let isDeployedProcessDefinition = function (
  processDefinitionId,
  processInstanceId,
  taskId
) {
  if (
    processDefinitionId === null ||
    processDefinitionId === undefined ||
    typeof processDefinitionId != 'string'
  ) {
    processDefinitionId = ''
  }
  if (
    processInstanceId === null ||
    processInstanceId === undefined ||
    typeof processInstanceId != 'string'
  ) {
    processInstanceId = ''
  }
  if (taskId === null || taskId === undefined || typeof taskId != 'string') {
    taskId = ''
  }
  let functionName = 'WorkFlow_IsDeployedProcessDefinition'
  let expression =
    functionName +
    '(' +
    '"' +
    processDefinitionId +
    '",' +
    '"' +
    processInstanceId +
    '",' +
    '"' +
    taskId +
    '"' +
    ')'

  let findParam = {
    expression: expression
  }
  let paramData = jsonUtil.obj2json(findParam)
  let rtObj = viewOperation.doRequest(
    viewContext.getModuleId(),
    'WebExecuteFormulaExpression',
    paramData
  )
  if (rtObj === null || rtObj === undefined) {
    throw new Error(
      '[workflowUtil.isDeployedProcessDefinition]调用后台函数:' +
        functionName +
        '失败，返回值对象为空,请检查后台函数实现方式是否错误'
    )
  }
  let result = null
  if (rtObj.success === true) {
    let rtData = rtObj['data']
    if (
      rtData === null ||
      rtData === undefined ||
      rtData['result'] === null ||
      rtData['result'] === undefined
    ) {
      throw new Error(
        '[workflowUtil.isDeployedProcessDefinition]调用后台函数:' +
          functionName +
          '失败,返回对象不存在data属性值，或者data属性不存在result属性值'
      )
    }
    result = rtData['result']
  } else {
    let errorMsg = rtObj.msg
    throw new Error(
      '[workflowUtil.isDeployedProcessDefinition]调用后台函数:' +
        functionName +
        '失败,原因:' +
        errorMsg
    )
  }

  if (typeof result != 'boolean') {
    throw new Error(
      '[workflowUtil.isDeployedProcessDefinition]调用后台函数:' +
        functionName +
        '失败,规则返回值不是布尔类型,无法判断'
    )
  }

  return result
}

/**
 * 校验流程定义是否合法
 * @param {Object} processDefinitionXmlTable 流程XML所在表
 * @param {Object} processDefinitionId 流程定义ID
 * @return {String} 如果校验不通过则返回不通过的校验信息，如果校验通过返回空字符串
 */
let checkProcessDefinitionValid = function (
  processDefinitionXmlTable,
  processDefinitionId
) {
  let functionName = 'WorkFlow_CheckProcessDefinitionValid'
  if (!processDefinitionXmlTable || processDefinitionXmlTable == '') {
    throw new Error(
      '[workflowUtil.checkProcessDefinitionValid]调用后台函数:' +
        functionName +
        '失败，流程定义XML表名为空，无法进行校验.'
    )
  }
  if (!processDefinitionId || processDefinitionId == '') {
    throw new Error(
      '[workflowUtil.checkProcessDefinitionValid]调用后台函数:' +
        functionName +
        '失败，流程定义记录ID为空，无法进行校验.'
    )
  }

  //因为xml包含一些奇怪的字符所以需要对流程定义XML进行编码
  let expression =
    functionName +
    '(' +
    '"' +
    processDefinitionXmlTable +
    '", "' +
    processDefinitionId +
    '")'

  let findParam = {
    expression: expression
  }
  let paramData = jsonUtil.obj2json(findParam)
  let rtObj = viewOperation.doRequest(
    viewContext.getModuleId(),
    'WebExecuteFormulaExpression',
    paramData
  )
  if (rtObj === null || rtObj === undefined) {
    throw new Error(
      '[workflowUtil.checkProcessDefinitionValid]调用后台函数:' +
        functionName +
        '失败，返回值对象为空,请检查后台函数实现方式是否错误'
    )
  }
  let result = null
  if (rtObj.success === true) {
    let rtData = rtObj['data']
    if (
      rtData === null ||
      rtData === undefined ||
      rtData['result'] === null ||
      rtData['result'] === undefined
    ) {
      throw new Error(
        '[workflowUtil.checkProcessDefinitionValid]调用后台函数:' +
          functionName +
          '失败,返回对象不存在data属性值，或者data属性不存在result属性值'
      )
    }
    result = rtData['result']
  } else {
    let errorMsg = rtObj.msg
    throw new Error(
      '[workflowUtil.checkProcessDefinitionValid]调用后台函数:' +
        functionName +
        '失败,原因:' +
        errorMsg
    )
  }

  if (typeof result == 'string' && result.length > 0) {
    return result
  }

  return ''
}

/**
 * 从页面实体表中动态读取流程变量记录，并生成变量信息
 * @param {Object} tableName 来源表名
 * @param {Object} variantKeyField 流程变量名称列
 * @param {Object} variantValueField 流程变量值列
 * @param {Object} variantTypeField 流程变量类型列
 */
let getDymanicProcessVariant = function (
  tableName,
  variantKeyField,
  variantValueField,
  variantTypeField
) {
  if (!viewModel.getMetaModule().isDataSourceExist(tableName)) {
    return null
  }
  let variantRecords = viewModel.getDataModule().getAllRecordsByDS(tableName)
  if (!variantRecords || variantRecords.length < 0) {
    return null
  }
  let variantMap = {}
  for (let i = 0; i < variantRecords.length; i++) {
    let varRecords = variantRecords[i]
    let varKey = varRecords.get(variantKeyField)
    let varValue = varRecords.get(variantValueField)
    let varType = varRecords.get(variantTypeField)
    variantMap[varKey] = varValue
  }
  return variantMap
}

export {
  checkProcessDefinitionValid,
  generateNextExecutionUnitIds,
  getComponentId,
  getNextActivityIds,
  getNextActivityInfo,
  getNextActivityIsEnd,
  getNextActivityIsStart,
  getProcessDefinitionIdField,
  getProcessDefinitionXmlField,
  getProcessGraphXmlField,
  getProcessIdField,
  getProcessInstanceIdField,
  getProcessTaskIdField,
  getProcessVariables,
  getRecordsFromOpenModule,
  getRecordsFromOpenModuleAsync,
  isDeployedProcessDefinition,
  processOperation
}
