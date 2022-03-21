import { ExceptionFactory as factory } from '@v-act/vjs.framework.extension.platform.interface.exception'
// 规则主入口(必须有)
import { RuleContext } from '@v-act/vjs.framework.extension.platform.services.integration.vds.rule'
import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { WidgetAction as widgetAction } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import { WindowVMMappingManager as windowVMManager } from '@v-act/vjs.framework.extension.platform.services.vmmapping.manager'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

const main = function (ruleContext: RuleContext) {
  //@ts-ignore
  let inParamsObj: Record<string, any> = jsonUtil.json2obj(
    ruleContext.getRuleCfg()['inParams']
  )

  //解析参数
  let Entiry: Record<string, any> = inParamsObj['EntityMoveByRecord']
  if (!Entiry) {
    return false
  }
  // 源实体
  let record: Record<string, any> =
    Entiry['datas'] && Entiry['datas']['values'] && Entiry['datas']['values'][0]
  let sourceName: undefined | null | string = record && record['sourceName']
  if (sourceName == undefined || sourceName == null) {
    return false
  }

  // 移動方式
  let Operation: undefined | null | string = record && record['operation']
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
      //@ts-ignore
      type: factory.TYPES.Dialog,
      message: '实体不存在！sourceName=' + sourceName
    })
    throw exception
  }

  // 源记录集合
  let datasource: {
    getAllRecords: () => any
    getCurrentRecord: () => any
    setCurrentRecord: (x: any) => any
  } = manager.lookup({
    datasourceName: sourceName
  })

  let locateCurrRecord: null | string = ''

  let records: any = datasource.getAllRecords()
  if (records) records = records.toArray()

  if (records == null || records.length == 0) {
    return false
  }

  let currRecord: { getSysId: () => string } = datasource.getCurrentRecord()

  //获取记录索引
  let GetRecordIndex = function (arrary: any[], Id: string) {
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
      var currIndex: number = GetRecordIndex(records, currRecord.getSysId())
      if (currIndex - 1 >= 0) locateCurrRecord = records[currIndex - 1]
      break
    case 'next':
      var currIndex: number = GetRecordIndex(records, currRecord.getSysId())
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

  let widgetId: any[] = windowVMManager.getWidgetCodesByDatasourceName({
    datasourceName: sourceName
  })

  if (widgetId instanceof Array) {
    for (let _a = 0; _a < widgetId.length; _a++) {
      let type: string = widgetContext.getType(widgetId[_a])
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
            //@ts-ignore
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
    let type: string = widgetContext.getType(widgetId)
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
          //@ts-ignore
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
