import { ExceptionFactory as exceptionFactory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { DatasourceManager as datasourceManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { WidgetAction as widgetAction } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'

export function initModule(sb) {}

const main = function (param) {
  let args = param.getArgs()
  if (args.length != 3)
    exceptionHandler('函数 GetSelectedDateToEntity 参数个数必须为3个!')

  let widgetCode = args[0]
  if (!widgetCode)
    exceptionHandler(
      '函数 GetSelectedDateToEntity 第一个参数,控件Code不能为空!'
    )

  let entityCode = args[1]
  if (!entityCode)
    exceptionHandler(
      '函数 GetSelectedDateToEntity 第二个参数,实体名称不能为空!'
    )

  let fieldName = args[2]
  if (!fieldName)
    exceptionHandler(
      '函数 GetSelectedDateToEntity 第三个参数,实体字段名称不能为空!'
    )

  // 调用控件Action方法
  let selectedDate = widgetAction.executeWidgetAction(
    widgetCode,
    'getSelectedDate',
    widgetCode
  )

  let routeContext = param.getRouteContext()

  let ds = _getDataSource(entityCode)
  insertDateToEntity(ds, fieldName, selectedDate)

  return true
}

let insertDateToEntity = function (datasource, fieldName, dates) {
  if (!datasource || !dates || dates.length === 0 || !fieldName) return

  let insertRecords = []

  for (let i = 0, len = dates.length; i < len; i++) {
    let date = dates[i]
    let emptyRecord = datasource.createRecord()
    emptyRecord.set(fieldName, date)
    insertRecords.push(emptyRecord)
  }

  datasource.insertRecords({
    records: insertRecords,
    position: datasource.Position.BOTTOM
  })
  return insertRecords
}

let _getDataSource = function (dsName) {
  // 仅支持前台实体
  datasource = datasourceManager.lookup({
    datasourceName: dsName
  })
  return datasource
}

let exceptionHandler = function (message) {
  let exception = exceptionFactory.create({
    type: exceptionFactory.TYPES.Dialog,
    message: message
  })
  throw exception
}

export { main }
