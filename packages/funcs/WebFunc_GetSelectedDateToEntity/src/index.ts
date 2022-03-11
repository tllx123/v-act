import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
/**
 *  获取日历控件选中日期并新增到对应实体
 *  代码示例:
 *  GetSelectedDateToEntity("JGCalendar1", "Entity1", "date")
 *  参数数量:3
 *  参数1(字符串类型，必填，控件Code)
 *  参数2(字符串类型，必填，实体Code)
 *  参数3(字符串类型，必填，实体字段名)
 *
 *  返回值
 */
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as widget from '@v-act/vjs.framework.extension.platform.services.integration.vds.widget'

const vds = { exception, widget, ds }

var insertDateToEntity = function (
  datasource: any,
  fieldName: string,
  dates: []
) {
  if (!datasource || !dates || dates.length === 0 || !fieldName) return

  var insertRecords = []

  for (var i = 0, len = dates.length; i < len; i++) {
    var date = dates[i]
    var emptyRecord = datasource.createRecord()
    emptyRecord.set(fieldName, date)
    insertRecords.push(emptyRecord)
  }

  datasource.insertRecords(insertRecords, datasource.Position.BOTTOM)
  return insertRecords
}

var _getDataSource = function (dsName: string) {
  // 仅支持前台实体
  var datasource = vds.ds.lookup(dsName)
  return datasource
}

const main = function (
  widgetCode: string,
  entityCode: string,
  fieldName: string
) {
  if (!widgetCode)
    throw vds.exception.newConfigException(
      '函数 GetSelectedDateToEntity 第一个参数,控件Code不能为空!'
    )

  if (!entityCode)
    throw vds.exception.newConfigException(
      '函数 GetSelectedDateToEntity 第二个参数,实体名称不能为空!'
    )

  if (!fieldName)
    throw vds.exception.newConfigException(
      '函数 GetSelectedDateToEntity 第三个参数,实体字段名称不能为空!'
    )

  // 调用控件Action方法
  var selectedDate = vds.widget.execute(
    widgetCode,
    'getSelectedDate',
    widgetCode
  )
  var ds = _getDataSource(entityCode)
  insertDateToEntity(ds, fieldName, selectedDate)

  return true
}
export { main }
