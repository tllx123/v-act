import { ExceptionFactory as factory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { WidgetAction as widgetAction } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import { WindowVMMappingManager as windowVMManager } from '@v-act/vjs.framework.extension.platform.services.vmmapping.manager'
import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util.json'

let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined

// 初始化vjs模块，如果规则逻辑需要引用相关vjs服务，则初始化相关vjs模块；如果不需要初始化逻辑可以为空
exports.initModule = function (sBox) {}

// 规则主入口(必须有)
let main = function (ruleContext) {
  let inParamsObj = jsonUtil.json2obj(ruleContext.getRuleCfg()['inParams'])

  //解析参数
  let Entiry = inParamsObj['EntityMoveByRecord']
  if (!Entiry) {
    return false
  }
  // 源实体
  let record =
    Entiry['datas'] && Entiry['datas']['values'] && Entiry['datas']['values'][0]
  let sourceName = record && record['sourceName']
  if (sourceName == undefined || sourceName == null) {
    return false
  }

  // 移動方式
  let Operation = record && record['operation']
  if (Operation == null || Operation == undefined) {
    Operation = 'first'
  }
  Operation = Operation.toLowerCase()

  if (
    !manager.exists({
      datasourceName: sourceName
    })
  ) {
    //throw new Error("实体不存在！sourceName=" + sourceName);
    let exception = factory.create({
      type: factory.TYPES.Dialog,
      message: '实体不存在！sourceName=' + sourceName
    })
    throw exception
  }

  // 源记录集合
  let datasource = manager.lookup({
    datasourceName: sourceName
  })

  let locateCurrRecord

  let records = datasource.getAllRecords()
  if (records) records = records.toArray()

  if (records == null || records.length == 0) {
    return false
  }

  let currRecord = datasource.getCurrentRecord()

  //获取记录索引
  let GetRecordIndex = function (arrary, Id) {
    for (let i = 0, len = arrary.length; i < len; i++) {
      if (arrary[i].getSysId() === Id) return i
    }
    return -1
  }

  switch (Operation) {
    case 'first':
      //locateCurrRecord = records[0];
      locateCurrRecord = datasource.getAllRecords().first()
      break
    case 'last':
      //locateCurrRecord = records[RecordCount - 1];
      locateCurrRecord = datasource.getAllRecords().last()
      break
    case 'prior':
      var currIndex = GetRecordIndex(records, currRecord.getSysId())
      if (currIndex - 1 >= 0) locateCurrRecord = records[currIndex - 1]
      break
    case 'next':
      var currIndex = GetRecordIndex(records, currRecord.getSysId())
      if (currIndex + 1 < records.length)
        locateCurrRecord = records[currIndex + 1]
      break
  }

  if (locateCurrRecord == null || locateCurrRecord.length == 0) {
    return false
  }

  //设置当前实体
  datasource.setCurrentRecord({
    record: locateCurrRecord
  })

  let widgetId = windowVMManager.getWidgetCodesByDatasourceName({
    datasourceName: sourceName
  })

  if (widgetId instanceof Array) {
    for (let _a = 0; _a < widgetId.length; _a++) {
      let type = widgetContext.getType(widgetId[_a])
      if (locateCurrRecord) {
        if (
          'JGBizCodeTreeGrid' == type ||
          'JGBizCodeTreeView' == type ||
          'JGDataGrid' == type ||
          'JGTreeGrid' == type ||
          'JGTreeView' == type
        ) {
          widgetAction.executeWidgetAction(
            widgetId[_a],
            'locateRecord',
            locateCurrRecord
          )
        }
        //设置当前实体
        datasource.setCurrentRecord({
          record: locateCurrRecord
        })
      }
    }
  } else {
    let type = widgetContext.getType(widgetId)
    if (locateCurrRecord) {
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
          locateCurrRecord
        )
      }
      //设置当前实体
      datasource.setCurrentRecord({
        record: locateCurrRecord
      })
    }
  }
}

export { main }
