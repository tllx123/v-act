import { log as logUtil } from '@v-act/vjs.framework.extension.util'
import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util'
import { ComponentParam as componentParam } from '@v-act/vjs.framework.extension.platform.data.storage.runtime.param'
import { WindowParam as windowParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { DatasourcePusher as pusher } from '@v-act/vjs.framework.extension.platform.services.domain.datasource'
import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { ExpressionEngine as engine } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { WidgetAction as widgetAction } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { ExceptionFactory as factory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
let undefined
let undefined
let viewModel
// 增加公式解析引用 zhangliang
let ExceptionFactory
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined

exports.initModule = function (sBox) {}
let main = function (ruleContext) {
  let ruleConfig = ruleContext.getRuleCfg()
  let inParams = ruleConfig.inParams
  let inParamObj = jsonUtil.json2obj(inParams)

  let dataSourceName = inParamObj.dataName
  let dataType = inParamObj.dataType // 为Table或Tree
  let uploadControlId = inParamObj.uploadControlId // 上传控件id
  let importNodeId = inParamObj.importNodeId // 导入目标树节点id
  let treeStruct = inParamObj.treeStruct // 树结构配置

  if (uploadControlId == null || uploadControlId == '') {
    alert('规则配置中的上传控件id不能为空')
    return false
  }
  //		var comp = actionHandler.executeWidgetAction(uploadControlId, "getComponent");
  let comp = widgetAction.executeWidgetAction(uploadControlId, 'getComponent')

  if (!comp) {
    alert('找不到执行导入的文件控件')
    return false
  }

  dataType = dataType.toLowerCase()

  // 得到导入的目标节点id值
  let selectId = ''
  if (dataType == 'tree') {
    if (treeStruct == null || treeStruct.length == 0) {
      alert('规则配置中没有树结构信息')
      return false
    }
    if (treeStruct[0].type != '1' && treeStruct[0].type != '2') {
      alert('规则配置中树类型只能为层级码树或左右树')
      return false
    }
    if (importNodeId != null && importNodeId != '') {
      //				selectId = formulaUtil.evalExpression(importNodeId);

      let context = new ExpressionContext()
      context.setRouteContext(ruleContext.getRouteContext())
      let selectId = engine.execute({
        expression: 'importNodeId',
        context: context
      })
    }
  }
  // 得到字段值包括表达式 Express、实体字段 Entity、系统变量 System、组件变量 Component
  let varMap = {}
  for (let i = 0; i < inParamObj.dgcolumn.length; i++) {
    let source = inParamObj.dgcolumn[i].source
    let fieldName = inParamObj.dgcolumn[i].fieldName
    let value = inParamObj.dgcolumn[i].value
    if (source === 'Entity') {
      dataSourceName = value.substring(0, value.indexOf('.'))
      //				var currentRow = viewModel.getDataModule().getCurrentRowByDS(dataSourceName);
      let datasource = manager.lookup({ datasourceName: dataSourceName })
      let currentRow = datasource.getCurrentRecord()

      //				var db = dbManager.getDB(dataSourceName);
      let datasource = manager.lookup({
        datasourceName: changeDsArr[changeIndex]
      })
      let db = datasourceclearRemoveDatas()

      if (currentRow != null) {
        varMap[fieldName] = currentRow.get(value)
      } else {
        varMap[fieldName] = null
      }
    } else if (source === 'System') {
      // 如果是系统变量
      //				varMap[fieldName] = viewContext.getSystemVariableValue(value);
      varMap[fieldName] = componentParam.getVariant({ code: value })
    } else if (source === 'Component') {
      // 如果是组件变量
      //				varMap[fieldName] = viewContext.getVariableValue(value);
      varMap[fieldName] = windowParam.getInput({ code: value })
    } else if (source === 'Express' || source === 'expression') {
      // 如果是表达式
      // 2015-05-29 liangchaohui：3.x后改成expression
      //				varMap[fieldName] = formulaUtil.evalExpression(value);
      let context = new ExpressionContext()
      context.setRouteContext(ruleContext.getRouteContext())
      varMap[fieldName] = engine.execute({
        expression: value,
        context: context
      })
    }
  }

  let actionType = 'importTable'
  let routeRuntime = ruleContext.getRouteContext()
  let transactionId = routeRuntime.getTransactionId()
  // actionType="importEntity";
  let option = {
    ruleInstId: ruleConfig.instanceCode,
    selectId: selectId,
    action: actionType,
    varMap: varMap,
    ruleConfig: jsonUtil.obj2json(inParamObj),
    instance: transactionId
  }

  let scopeId = scopeManager.getCurrentScopeId()
  let callback = function (arg1, arg2) {
    scopeManager.openScope(scopeId)
    try {
      logUtil.log('结束发送时间：' + new Date().toLocaleTimeString())
      if (arg2) {
        if (arg2.success) {
          ruleContext.setRuleStatus(true)
          ruleContext.fireRuleCallback()
          ruleContext.fireRouteCallback()
        } else {
          let type = arg2.exceptionType
          let msg = arg2.msg
          //						var exception = ExceptionFactory.create(type, msg);
          let exception = factory.create({ type: type, message: msg })
          //TYPES枚举值：Expected，UnExpected，Business，Dialog，Unlogin，Expression
          ruleContext.handleException(exception)
        }
      } else {
        logUtil.error('上传控件回调参数不正确，请处理！')
      }
    } finally {
      scopeManager.closeScope()
    }
  }
  let start = new Date()
  logUtil.log('开始发送时间：' + start.toLocaleTimeString())
  ruleContext.markRouteExecuteUnAuto()
  //		actionHandler.executeWidgetAction(uploadControlId, "importData", option, callback);
  widgetAction.executeWidgetAction(
    uploadControlId,
    'importData',
    option,
    callback
  )
  //		ruleContext.setRuleCallbackFireFlag(true);

  ruleContext.setRuleCallback(true)
  return true
}

function importEntityCallback(fileObj, resultObj) {
  if (resultObj.data == null || resultObj.data.length == 0) return
  let d = new Date()

  let insertRecords = []
  //		var emptyRecord = viewModel.getDataModule().createEmptyRecordByDS(dataSourceName);
  let datasource = manager.lookup({ datasourceName: dataSourceName })
  let emptyRecord = datasource.createRecord()

  for (let i = 0; i < resultObj.data.length; i++) {
    let newRecord = emptyRecord.createNew()
    let obj = resultObj.data[i]

    for (let fieldName in obj) {
      if (fieldName.toLowerCase() == 'id') continue
      newRecord.set(fieldName, obj[fieldName])
    }
    insertRecords.push(newRecord)
  }
  //		viewModel.getDataModule().insertByDS(dataSourceName, insertRecords);
  let datasource = manager.lookup({ datasourceName: dataSourceName })
  let rs = datasource.insertRecords({ records: [insertRecords] })

  pusher.loadRecords({ datasourceName: dataSourceName, records: insertRecords })

  let end = new Date()
  // logUtil.info("完成处理结果："+end.toLocaleTimeString()+",显示用时"+(end-d)+",总用时"+(end-start));
}

export { main }
