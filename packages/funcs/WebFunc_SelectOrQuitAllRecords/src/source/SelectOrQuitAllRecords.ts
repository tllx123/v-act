import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'

let undefined

exports.initModule = function (sb) {}

let main = function (param) {
  let args = param.getArgs()
  let dsName = args[0]
  let operType = args[1]
  let routeContext = param.getRouteContext()
  if (dsName == null) throw new Error('实体名称不允许为空，请检查')
  if (operType == null) throw new Error('取消或选择类型没穿参数，请检查')
  let datasource = null
  datasource = manager.lookup({
    datasourceName: dsName
  })

  if (!datasource) throw new Error('实体变量无法识别！')
  let allRecords = datasource.getAllRecords().toArray()
  let operRecords = []
  for (let i = 0; i < allRecords.length; i++) {
    let record = allRecords[i]
    if (datasource.isSelectedRecord({ record: record })) {
      continue
    }
    operRecords.push(record)
  }
  datasource.markMultipleSelect()
  if (operType == 'select') {
    datasource.selectRecords({
      records: operRecords,
      isSelect: true
    })
  } else {
    datasource.selectRecords({
      records: allRecords,
      isSelect: false
    })
  }

  return operType
}

export { main }
