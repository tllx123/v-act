import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
/**
 *	将变量值赋值到实体
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'

const vds = { object, ds, exception }

const main = function (variables: string | object) {
  if (variables) {
    let input = {}
    if (typeof variables == 'string') {
      input = JSON.parse(variables)
    } else {
      input = variables
    }
    for (const variableName in input) {
      const datasource = vds.ds.lookup(variableName)
      if (!datasource) {
        throw vds.exception.newConfigException(
          '无法获取实体【' + variableName + '】, 请检查实体是否存在'
        )
      }
      datasource.clear()
      const val = variables[variableName]
      if (Object(val) === val) {
        const datas = val.datas
        if (!datas) {
          continue
        }
        const insertRecords = []
        for (let i = 0, len = datas.values.length; i < len; i++) {
          const data = datas.values[i]
          const emptyRecord = datasource.createRecord()
          for (const fieldCode in data) {
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
