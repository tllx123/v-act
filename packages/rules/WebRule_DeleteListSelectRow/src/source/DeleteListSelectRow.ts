import {
  ExpressionContext,
  ExpressionEngine as engine
} from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

export function initModule(sb) {}

const main = function (ruleContext) {
  let deleteParams = jsonUtil.json2obj(ruleContext.getRuleCfg()['inParams'])
  let dsName = deleteParams['TableName']
  let condition = deleteParams['Condition']
  //删除方式，0表示删除当前选中记录,1表示删除指定条件记录(条件为空时删除所有的)，如果删除方式为空,默认为删除当前选中记录
  let deleteType = deleteParams['deleteType']
  let EntityType = deleteParams['EntityType']
  let treeStruct = null
  let context = new ExpressionContext()
  let datasource = getDataSource(dsName, ruleContext, EntityType) //根据类型获取数据源
  let removeIds = getRemoveIds(
    datasource,
    condition,
    deleteType,
    ruleContext.getRouteContext()
  )
  if (undefined != removeIds && null != removeIds && removeIds.length > 0) {
    // 删除数据
    //_removeRecords(dsName, removeIds);
    datasource.removeRecordByIds({
      ids: removeIds
    })
  }
}

/**
 * 获取主表删除的id
 * @param dsName 待删除表数据源名称
 * @param condition 条件
 * @param deleteType 删除方式
 */
let getRemoveIds = function (ds, condition, deleteType, routeContext) {
  //删除方式，0表示删除当前选中记录,1表示删除指定条件记录(条件为空时删除所有的),如果删除方式为空，默认为删除当前选中记录
  if (deleteType == null) deleteType = '0'

  let removeIds = []
  let datasource = ds
  //0表示删除当前选中记录
  if (deleteType == '0' || deleteType == 0) {
    let retRecords = datasource.getSelectedRecords().toArray()

    // 取选中行
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
  } else if (deleteType == '1' || deleteType == 1) {
    //1表示删除指定条件记录
    let records = datasource.getAllRecords().toArray()
    if (undefined != records && null != records && records.length > 0) {
      for (let index = 0; index < records.length; index++) {
        let record = records[index]
        let id = record.getSysId()
        //条件为空时删除所有的
        if (condition == null || condition.length == 0) {
          removeIds.push(id)
          continue
        }

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
        if (ret == true) {
          removeIds.push(id)
        }
      }
    }
  }

  return removeIds
}

/**
 * 扩展viewModel.removeByDS方法，特殊的控件类型，特殊处理
 * @param dsName 数据源
 * @param removeIds 删除的记录ID
 */
let removeRecordsByWidgetType = function (dsName, removeIds) {
  let datasource = manager.lookup({
    datasourceName: dsName
  })
  datasource.removeRecordByIds({
    ids: removeIds
  })
}

/**
 * 递归需要删除的数据源及其下级数据源，从页面上搜集需要联动删除的记录
 * @param dsName 数据源
 * @param ids 查询的ids
 */
let _removeRecords = function (dsName, ids) {
  if (!ids || ids.length <= 0) {
    return
  }
  removeRecordsByWidgetType(dsName, ids)
}
/**
 * 获取数据源
 * @param ds 数据源名称
 * @param ruleContext 规则上下文
 * @param EntityType 实体类型
 */
let getDataSource = function (ds, ruleContext, EntityType) {
  //获取数据源
  let dsName = ds
  let datasource = null
  if (undefined == EntityType || EntityType == 'window') {
    datasource = manager.lookup({
      datasourceName: dsName
    })
  } else {
    switch (EntityType) {
      case 'ruleSetInput':
        dsName = 'BR_IN_PARENT.' + dsName
        break
      case 'ruleSetVar':
        dsName = 'BR_VAR_PARENT.' + dsName
        break
      case 'ruleSetOutput':
        dsName = 'BR_OUT_PARENT.' + dsName
        break
    }
    let context = new ExpressionContext()
    context.setRouteContext(ruleContext.getRouteContext())
    datasource = engine.execute({
      expression: dsName,
      context: context
    })
  }
  if (!datasource)
    throw new Error('规则[DeleteListSelectRow]：找不到参数中的实体！' + dsName)
  return datasource
}

export { _removeRecords, getRemoveIds, main }
