import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { DatasourcePuller as datasourcePuller } from '@v-act/vjs.framework.extension.platform.services.domain.datasource'
import {
  ExpressionContext,
  ExpressionEngine as engine
} from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { TreeManager as treeManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.tree'
import { RemoteMethodAccessor as remoteMethodAccessor } from '@v-act/vjs.framework.extension.platform.services.operation.remote'
import { WhereRestrict as whereRestrict } from '@v-act/vjs.framework.extension.platform.services.where.restrict'
import { ArrayUtil as util } from '@v-act/vjs.framework.extension.util.array'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'
import { Log as logUtil } from '@v-act/vjs.framework.extension.util.logutil'

export function initModule(sb) {}

const main = function (ruleContext) {
  let ruleCfg = ruleContext.getRuleCfg()
  let params = ruleCfg['inParams']
  let ruleInstId = ruleCfg['ruleInstId']
  let inParamsObj = jsonUtil.json2obj(params)
  let dtChileMaps = inParamsObj['dtChileMaps'] // 获取数据源关联的删除信息
  //var dsName = inParamsObj["tableName"]; // 获取需要删除的数据源，已无效
  let condition = inParamsObj['Condition']
  let treeStructs = inParamsObj['treeStruct']

  let scope = scopeManager.getScope()
  let windowScope = scopeManager.getWindowScope()
  let moduleId = windowScope.getWindowCode()
  let routeContext = ruleContext.getRouteContext()
  //var scope = scopeManager.getWindowScope();
  //inParamsObj["dsName"] = dsName; 无效
  inParamsObj['moduleId'] = moduleId

  let treeStruct = null
  if (
    !util.isArray(treeStructs) ||
    (util.isArray(treeStructs) && treeStructs.length < 1)
  ) {
    treeStruct = null
  } else {
    treeStruct = treeStructs[0]
  }

  // 组装后台删除数据条件
  let isDelete = false // 后台是否删除数据标记位
  if (
    undefined != dtChileMaps &&
    null != dtChileMaps &&
    dtChileMaps.length > 0
  ) {
    for (let i = 0; i < dtChileMaps.length; i++) {
      let delCfg = dtChileMaps[i]
      let dsWhere = delCfg.dsWhere
      let delDs = delCfg.tableName
      let orderNo = delCfg.orderNo
      delCfg['sql'] = null
      if (undefined != dsWhere && null != dsWhere && dsWhere.length > 0) {
        // 有进行字段的配置，按照配置生成条件sql
        let w = whereRestrict.init({
          routeContext: ruleContext.getRouteContext()
        })
        w.andExtraCondition(dsWhere, 'custom')
        delCfg['sql'] = w.toWhere()
        delCfg['parameters'] = w.toParameters()
      } else {
        // TODO:预留 没有附加条件时，是否需要进行其他处理
      }
    }
    isDelete = true
  }
  inParamsObj['isDelete'] = isDelete

  let isSave = false // 后台是否需要保存标记位
  let changeDsArr = [] // 保存的删除数据源
  inParamsObj['isSave'] = isSave

  // 调用完活动集之后的回调方法
  let callback = function (responseObj) {
    //var outputResult = responseObj.data.result;
    let success = responseObj.IsSuccess
    if (success != true) {
      throw new Error('删除数据失败')
    }
    // 重新设置页面删除的标记位
    if (changeDsArr) {
      for (
        let changeIndex = 0;
        changeIndex < changeDsArr.length;
        changeIndex++
      ) {
        let datasource = manager.lookup({
          datasourceName: changeDsArr[changeIndex]
        })
        datasource && datasource.clearRemoveDatas()
      }
    }
    ruleContext.fireRouteCallback()
  }
  let errorCallback = function (responseObj) {
    logUtil.error(responseObj.message)
    ruleContext.handleException(responseObj)
  }

  let sConfig = {
    isAsyn: true,
    componentCode: scope.getComponentCode(),
    transactionId: routeContext.getTransactionId(),
    ruleSetCode: 'CommonRule_DeleteConditionRelationData',
    commitParams: [
      {
        paramName: 'SaveAndDeleteConfig',
        paramType: 'char',
        paramValue: jsonUtil.obj2json(inParamsObj)
      }
    ],
    error: errorCallback,
    afterResponse: callback
  }
  let scopeId = scope.getInstanceId()
  if (scopeManager.isWindowScope(scopeId)) {
    sConfig.windowCode = windowScope.getWindowCode()
  }

  remoteMethodAccessor.invoke(sConfig)
  ruleContext.markRouteExecuteUnAuto()
  return true
}

/**
 * 获取主表删除的id
 * @param dsName 待删除表数据源名称
 * @param condition 条件
 */
let getRemoveIds = function (dsName, condition, routeContext) {
  let removeIds = []
  // 如果存在条件数组，按照条件数组过滤实体数据。否则，取实体选中行数据
  if (undefined != condition && null != condition && condition.length > 0) {
    let datasource = manager.lookup({
      datasourceName: dsName
    })
    let records = datasource.getAllRecords()

    if (
      undefined != records &&
      null != records &&
      records.toArray().length > 0
    ) {
      records = records.toArray()
      for (let index = 0; index < records.length; index++) {
        let record = records[index]
        let context = new ExpressionContext()
        context.setRouteContext(routeContext)
        context.setRecords([record])
        let ret = engine.execute({
          expression: condition,
          context: context
        })
        if (typeof ret != 'boolean') {
          throw '条件必须返回布尔类型，请检查'
        }
        let id = record.getSysId()
        if (ret == true) {
          removeIds.push(id)
        }
      }
    }
  } else {
    // 临时方案：没有选中行数据，取当前行数据
    let retRecords = datasourcePuller.getSelectedAndCurrentRecords({
      datasourceName: dsName
    })
    // 遍历数据取主键id
    if (
      undefined != retRecords &&
      null != retRecords &&
      retRecords.length > 0
    ) {
      for (let rowsIndex = 0; rowsIndex < retRecords.length; rowsIndex++) {
        removeIds.push(retRecords[rowsIndex].getSysId())
      }
    }
  }
  return removeIds
}

/**
 * 递归需要删除的数据源及其下级数据源，从页面上搜集需要联动删除的记录
 * @param dsName 数据源
 * @param ids 查询的ids
 */
let _removeRecords = function (dsName, ids, treeStruct) {
  if (!ids || ids.length <= 0) {
    return
  }

  // 删除本数据源的记录
  removeRecordsByWidgetType(dsName, ids, treeStruct)
}

/**
 * 树的删除事件
 */
let treeRemoveByDS = function (dsName, ids, treeStruct) {
  if (ids && ids.length > 0) {
    let tree = treeManager.lookup({
      datasourceName: dsName,
      treeStruct: treeStruct
    })
    tree.removeNodeByIds({
      ids: [ids]
    })
  }
}

/**
 * 扩展viewModel.removeByDS方法，特殊的控件类型，特殊处理
 * @param dsName 数据源
 * @param removeIds 删除的记录ID
 * @param treeStruct  树结构信息
 */
let removeRecordsByWidgetType = function (dsName, removeIds, treeStruct) {
  if (
    null != treeStruct &&
    undefined != treeStruct &&
    dsName == treeStruct['tableName']
  ) {
    treeRemoveByDS(dsName, removeIds, treeStruct)
  } else {
    //viewModel.getDataModule().removeByDS(dsName, removeIds);
    let datasource = manager.lookup({
      datasourceName: dsName
    })
    datasource.removeRecordByIds({
      ids: removeIds
    })
  }
}

export { _removeRecords, getRemoveIds, main }
