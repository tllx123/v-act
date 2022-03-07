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
  // 是否需要选中
  let isSelect = inParams.isSelect
  // 取下一条实体记录
  let locateAllRecord = _getAllLocateEntityRecord(
    sourceName,
    condition,
    ruleContext.getRouteContext()
  )

  if (locateAllRecord.length > 0) {
    let datasource = manager.lookup({
      datasourceName: sourceName
    })
    if (datasource.isMultipleSelect()) {
      datasource.selectRecords({
        records: locateAllRecord,
        isSelect: isSelect
      })
    } else {
      if (locateAllRecord.length >= 2) {
        let widgetIds = windowVMManager.getWidgetCodesByDatasourceName({
          datasourceName: sourceName
        })
        for (let i = 0; i < widgetIds.length; i++) {
          let widgetId = widgetIds[i]
          let type = widgetContext.getType(widgetId)
          if (
            'JGBizCodeTreeGrid' == type ||
            'JGBizCodeTreeView' == type ||
            'JGDataGrid' == type ||
            'JGTreeGrid' == type ||
            'JGTreeView' == type
          ) {
            widgetAction.executeWidgetAction(
              widgetId,
              'locateRecord',
              locateAllRecord[locateAllRecord.length - 1]
            )
          }
        }
        //设置当前实体
        datasource.setCurrentRecord({
          record: locateAllRecord[locateAllRecord.length - 1]
        })
      } else {
        datasource.setCurrentRecord({
          record: locateAllRecord[0]
        })
      }
    }
  }
  //
  //		var widgetIds = windowVMManager.getWidgetCodesByDatasourceName({
  //			"datasourceName": sourceName
  //		});
  //		for(var i=0;i<widgetIds.length;i++){
  //			var widgetId = widgetIds[i];
  //			var type = widgetContext.getType(widgetId);
  //
  //			if ("JGBizCodeTreeGrid" == type || "JGBizCodeTreeView" == type || "JGDataGrid" == type || "JGTreeGrid" == type || "JGTreeView" == type) {
  //				if (locateAllRecord.length > 0) {
  //					var datasource = manager.lookup({
  //						"datasourceName": sourceName
  //					});
  //					if (datasource.isMultipleSelect()) {
  //						datasource.selectRecords({
  //							"records": locateAllRecord,
  //							"isSelect": isSelect
  //						});
  //					} else {
  //						if (locateAllRecord.length >= 2) {
  //							widgetAction.executeWidgetAction(widgetId, 'locateRecord', locateAllRecord[locateAllRecord.length - 1]);
  //							//设置当前实体
  //							datasource.setCurrentRecord({
  //								"record": locateAllRecord[locateAllRecord.length - 1]
  //							});
  //						} else {
  //							datasource.setCurrentRecord({
  //								"record": locateAllRecord[0]
  //							});
  //						}
  //
  //					}
  //				}
  //			}
  //		}
}

let _getAllLocateEntityRecord = function (sourceName, condition, routeContext) {
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

  if (condition == null || stringUtil.trim(condition) === '') {
    return records
  }

  // 过滤后的记录集合
  let results = []
  for (let i = 0; i < records.length; i++) {
    let record = records[i]
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
  return results
}

export { main }
