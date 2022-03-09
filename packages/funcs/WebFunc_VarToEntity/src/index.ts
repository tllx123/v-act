/**
 *	将变量值赋值到实体
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
const vds = { object, ds, exception }

const main = function (variables) {
  if (variables) {
    variables =
      typeof variables == 'string' ? eval('(' + variables + ')') : variables
    for (var variableName in variables) {
      var datasource = vds.ds.lookup(variableName)
      if (!datasource) {
        throw vds.exception.newConfigException(
          '无法获取实体【' + variableName + '】, 请检查实体是否存在'
        )
      }
      datasource.clear()
      var val = variables[variableName]
      if (Object(val) === val) {
        var datas = val.datas
        if (!datas) {
          continue
        }
        var insertRecords = []
        for (var i = 0, len = datas.values.length; i < len; i++) {
          var data = datas.values[i]
          var emptyRecord = datasource.createRecord()
          for (var fieldCode in data) {
            if (!data.hasOwnProperty(fieldCode)) {
              continue
            }
            emptyRecord.set(fieldCode, data[fieldCode])
          }
          insertRecords.push(emptyRecord)
        }
        datasource.insertRecords(insertRecords)
      }
    }
  }
}
export { main }
