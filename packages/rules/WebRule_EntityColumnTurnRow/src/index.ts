import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
// 主入口(必须有)
import { RuleContext } from '@v-act/vjs.framework.extension.platform.services.integration.vds.rule'

const vds = { ds }

const main = function (ruleContext: RuleContext) {
  return new Promise<void>(function (resolve, reject) {
    try {
      var cfgParams: Record<string, any> = ruleContext.getVplatformInput()
      var destName: string = cfgParams['destName']
      // 加载到的目标表名
      var sourceName: string = cfgParams['sourceName']
      var fieldMapping: any[] = cfgParams['fieldMapping']
      // 获取到来源表的字段结构信息
      var datasource: {
        getMetadata: () => any
        getAllRecords: () => { toArray: () => any[] }
      } = vds.ds.lookup(sourceName)
      var metadata: { getFields: () => any } = datasource.getMetadata()
      var srcDataMete: any[] = metadata.getFields()
      // 去获来源表的数据，可以只获取修改过的
      var srcData: any[] = datasource.getAllRecords().toArray()
      // 计算出第一个动态列字段
      var firstDynField: string = ''
      for (var i = 0; i < fieldMapping.length; i++) {
        if (fieldMapping[i].isDyn == true) {
          firstDynField = fieldMapping[i].src.split('.')[1]
          break
        }
      }
      // 计算出一行可以转换成多少列，通过正则表达式判断来源结构的原数据结尾的字段，并解算出转换列的前缀
      var transDataSize: number = 0
      var fieldPrefix: any[] = []
      var s = eval('/' + firstDynField + '$/i')
      for (var i = 0; i < srcDataMete.length; i++) {
        var srcField = srcDataMete[i].code
        if (s.test(srcField) && srcField != firstDynField) {
          fieldPrefix[transDataSize] = srcField.substring(
            0,
            srcField.length - firstDynField.length
          )
          transDataSize = transDataSize + 1
        }
      }
      // 转换处理，其实可以和目标数据生成合并，减少一次for
      var transedData: any[] = []
      var transedDataSize: number = 0
      for (var h = 0; h < srcData.length; h++) {
        var tempData: { get: (x: any[]) => string } = srcData[h]
        for (var i = 0; i < fieldPrefix.length; i++) {
          var row: any[] = []
          for (var j = 0; j < fieldMapping.length; j++) {
            if (fieldMapping[j].isDyn == true) {
              row[j] = tempData.get(
                fieldPrefix[i] + fieldMapping[j]['src'].split('.')[1]
              )
            } else {
              row[j] = tempData.get(fieldMapping[j]['src'].split('.')[1])
            }
          }
          transedData[transedDataSize] = row
          transedDataSize = transedDataSize + 1
        }
      }
      // 下面是将转换后的数据写到目标表中
      var insertRecords: any[] = []
      var destDatasource: {
        createRecord: () => any
        insertRecords: (x: any[]) => any
      } = vds.ds.lookup(destName)
      for (var i = 0; i < transedData.length; i++) {
        var emptyRecord: Record<string, any> = destDatasource.createRecord()
        for (var j = 0; j < fieldMapping.length; j++) {
          emptyRecord.set(fieldMapping[j].desc.split('.')[1], transedData[i][j])
        }
        insertRecords.push(emptyRecord)
      }
      if (insertRecords && insertRecords.length > 0) {
        destDatasource.insertRecords(insertRecords)
      }

      resolve()
    } catch (ex) {
      reject(ex)
    }
  })
}

export { main }
