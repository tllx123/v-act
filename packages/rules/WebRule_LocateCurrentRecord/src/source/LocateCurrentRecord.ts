import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import {
  ExpressionContext,
  ExpressionEngine as engine
} from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { WidgetAction as widgetAction } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import { WindowVMMappingManager as windowVMManager } from '@v-act/vjs.framework.extension.platform.services.vmmapping.manager'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'
import { Log as log } from '@v-act/vjs.framework.extension.util.logutil'
import { StringUtil as stringUtil } from '@v-act/vjs.framework.extension.util.string'

export function initModule(sBox) {}

const main = function (ruleContext) {
  let inParams = jsonUtil.json2obj(ruleContext.getRuleCfg().inParams)
  // 源实体
  let sourceName = inParams.sourceName
  // 源实体过滤条件
  let condition = inParams.condition
  // 是否当前行开始
  let isCurrentBegin = inParams.isCurrentBegin
  // 正向、反向 true正向、false反向
  let searchSort = inParams.searchSort
  ruleContext.markRouteExecuteUnAuto()
  // 获取当前域id
  let scopeId = scopeManager.getCurrentScopeId()
  let handleEvent = function () {
    // 开启域
    scopeManager.openScope(scopeId)
    // 取下一条实体记录
    let locateCurrRecord = _getLocateCurrEntityRecord(
      sourceName,
      condition,
      isCurrentBegin,
      searchSort,
      ruleContext.getRouteContext()
    )
    if (locateCurrRecord !== null) {
      let datasource = manager.lookup({
        datasourceName: sourceName
      })
      let widgetId = windowVMManager.getWidgetCodesByDatasourceName({
        datasourceName: sourceName
      })
      let widgetIds = []
      if (locateCurrRecord) {
        if (!(widgetId instanceof Array)) {
          widgetIds.push(widgetId)
        } else {
          widgetIds = widgetId
        }
        for (let _a = 0; _a < widgetIds.length; _a++) {
          let type = widgetContext.getType(widgetIds[_a])
          if (
            'JGBizCodeTreeGrid' == type ||
            'JGBizCodeTreeView' == type ||
            'JGDataGrid' == type ||
            'JGTreeGrid' == type ||
            'JGTreeView' == type
          ) {
            widgetAction.executeWidgetAction(
              widgetIds[_a],
              'locateRecord',
              locateCurrRecord
            )
          }
        }
        // 设置当前实体
        datasource.setCurrentRecord({
          record: locateCurrRecord
        })
      }
    }

    ruleContext.fireRuleCallback()
    ruleContext.fireRouteCallback()
    // 关闭域
    scopeManager.closeScope()
  }
  let tainFunc = ruleContext.genAsynCallback(handleEvent)
  setTimeout(tainFunc, 10)

  // if(widgetId instanceof Array){
  // for(var _a = 0;_a<widgetId.length;_a++){
  // var type = widgetContext.getType(widgetId[_a]);
  // if (locateCurrRecord) {
  // if ("JGBizCodeTreeGrid" == type || "JGBizCodeTreeView" ==
  // type || "JGDataGrid" == type || "JGTreeGrid" == type ||
  // "JGTreeView" == type) {
  // widgetAction.executeWidgetAction(widgetId[_a],
  // 'locateRecord', locateCurrRecord);
  // }
  // //设置当前实体
  // datasource.setCurrentRecord({
  // "record": locateCurrRecord
  // });
  // }
  // }
  // }else{
  // var type = widgetContext.getType(widgetId);
  // if (locateCurrRecord) {
  // if ("JGBizCodeTreeGrid" == type || "JGBizCodeTreeView" ==
  // type || "JGDataGrid" == type || "JGTreeGrid" == type ||
  // "JGTreeView" == type) {
  // widgetAction.executeWidgetAction(widgetId, 'locateRecord',
  // locateCurrRecord);
  // }
  // //设置当前实体
  // datasource.setCurrentRecord({
  // "record": locateCurrRecord
  // });
  // }
  // }
  // var type = widgetContext.getType(widgetId);
  //
  // if (locateCurrRecord) {
  // if(type instanceof Array){
  // for(var _a = 0;_a<type.length;_a++){
  // var _type = type[_a];
  // if ("JGBizCodeTreeGrid" == _type || "JGBizCodeTreeView" ==
  // _type || "JGDataGrid" == _type || "JGTreeGrid" == _type ||
  // "JGTreeView" == _type) {
  // widgetAction.executeWidgetAction(widgetId, 'locateRecord',
  // locateCurrRecord);
  // }
  //
  // //设置当前实体
  // datasource.setCurrentRecord({
  // "record": locateCurrRecord
  // });
  // }
  // }else{
  // if ("JGBizCodeTreeGrid" == type || "JGBizCodeTreeView" ==
  // type || "JGDataGrid" == type || "JGTreeGrid" == type ||
  // "JGTreeView" == type) {
  // widgetAction.executeWidgetAction(widgetId, 'locateRecord',
  // locateCurrRecord);
  // }
  //
  // //设置当前实体
  // datasource.setCurrentRecord({
  // "record": locateCurrRecord
  // });
  // }
  //
  // }
}

let _getLocateCurrEntityRecord = function (
  sourceName,
  condition,
  isCurrentBegin,
  searchSort,
  routeContext
) {
  if (
    !manager.exists({
      datasourceName: sourceName
    })
  ) {
    throw new Error('来源实体不存在！sourceName=' + sourceName)
  }

  // 源记录集合
  let datasource = manager.lookup({
    datasourceName: sourceName
  })
  let records = datasource.getAllRecords()
  if (records) records = records.toArray()
  let allRecords = []
  let currRecord = datasource.getCurrentRecord()

  // 从当前行开始
  if (isCurrentBegin) {
    let isCurr = false
    // 完整列表
    let locaRecordRecords = []
    // 查找顺序正向
    if (searchSort) {
      for (let i = 0; i < records.length; i++) {
        let record = records[i]
        let id = record.getSysId()
        if (id == currRecord.getSysId() || isCurr) {
          if (!isCurr) {
            isCurr = true
          }
          allRecords.push(record)
        }
      }

      // 构造完整的顺序列表
      for (let i = 0; i < records.length; i++) {
        let record = records[i]
        // 是否已经存在
        let isIn = false
        for (let j = 0; j < allRecords.length; j++) {
          let locaRecord = allRecords[j]
          if (record.getSysId() == locaRecord.getSysId()) {
            isIn = true
            break
          }
        }

        if (!isIn) {
          locaRecordRecords.push(record)
        }
      }
    } else {
      // 查找顺序反向
      for (let i = records.length - 1; i >= 0; i--) {
        let record = records[i]
        let id = record.getSysId()
        if (id == currRecord.getSysId() || isCurr) {
          if (!isCurr) {
            isCurr = true
          }
          allRecords.push(record)
        }
      }

      for (let i = records.length - 1; i >= 0; i--) {
        let record = records[i]
        // 是否已经存在
        let isIn = false
        for (let j = allRecords.length - 1; j >= 0; j--) {
          let locaRecord = allRecords[j]
          if (record.getSysId() == locaRecord.getSysId()) {
            isIn = true
            break
          }
        }
        if (!isIn) {
          locaRecordRecords.push(record)
        }
      }
    }

    // 还原完整的列表
    for (let i = 0; i < locaRecordRecords.length; i++) {
      let record = locaRecordRecords[i]
      allRecords.push(record)
    }
  } else {
    // 查找顺序正向
    if (searchSort) {
      for (let i = 0; i < records.length; i++) {
        allRecords.push(records[i])
      }
    } else {
      // 查找顺序反向
      for (let i = records.length - 1; i >= 0; i--) {
        allRecords.push(records[i])
      }
    }
  }

  if (allRecords == null || allRecords.length == 0) {
    log.warn('没有符合条件的记录！sourceName=' + sourceName)
    return null
  }

  // 如果只有一条记录
  if (allRecords.length == 1) {
    return allRecords[0]
  }

  if (condition == null || stringUtil.trim(condition) === '""') {
    return allRecords[0]
  }

  // 按条件对源记录集合进行过滤
  let locateCurrRecord

  // 过滤后的记录集合
  let results = []
  for (let i = 0; i < allRecords.length; i++) {
    let record = allRecords[i]

    try {
      let context = new ExpressionContext()
      context.setRouteContext(routeContext)
      context.setRecords([record])
      let ret = engine.execute({
        expression: condition,
        context: context
      })
      if (typeof ret != 'boolean') {
        throw new Error('条件必须返回布尔类型')
      }
      // 条件满足
      if (ret == true) {
        results.push(record)
      }
    } catch (e) {
      let message =
        '表达式执行错误！condition=' + condition + '错误信息：' + e.message
      log.error(message)
      throw new Error('实体过滤条件不正确！' + message)
    }
  }

  if (results.length == 0) {
    if (isCurrentBegin) {
      locateCurrRecord = currRecord
    } else {
      locateCurrRecord = records[0]
    }
  } else if (results.length == 1) {
    // 如果是所有行，下一条没记录时只能取当前条
    locateCurrRecord = results[0]
  } else {
    if (isCurrentBegin) {
      let reulst = results[0]
      if (reulst.getSysId() != currRecord.getSysId()) {
        // 如果当前行不是匹配记录选中第一条 返回第一条条件匹配记录
        return results[0]
      }
      locateCurrRecord = results[1]
    } else {
      // 2015-06-18 liangchaohui：只定位首行匹配的记录
      locateCurrRecord = results[0]
      // var reulst = results[0];
      // var allOne = allRecords[0];
      // if(reulst.getSysId() == allOne.getSysId() &&
      // currRecord.getSysId() == reulst.getSysId()){
      // locateCurrRecord = results[1];
      // }else{
      // locateCurrRecord = results[0];
      // }
    }
  }

  return locateCurrRecord
}

export { main }
