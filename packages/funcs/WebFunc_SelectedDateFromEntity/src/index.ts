/**
 *  获取日历控件选中日期并新增到对应实体
 *  代码示例:
 *  SelectedDateFromEntity("JGCalendar1", "Entity1", "date")
 *  参数数量:3
 *  参数1(字符串类型，必填，控件Code)
 *  参数2(字符串类型，必填，实体Code)
 *  参数3(字符串类型，必填，实体字段名),注意字段值
 *
 *  返回值
 */
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
import * as widget from '@v-act/vjs.framework.extension.platform.services.integration.vds.widget'
const vds = { exception, ds, widget }

const main = function (widgetCode:string, entityCode:string, fieldName:string) {
  if (!widgetCode)
    exceptionHandler('函数 SelectedDateFromEntity 第一个参数,控件Code不能为空!')

  if (!entityCode)
    exceptionHandler('函数 SelectedDateFromEntity 第二个参数,实体名称不能为空!')

  if (!fieldName)
    exceptionHandler(
      '函数 SelectedDateFromEntity 第三个参数,实体字段名称不能为空!'
    )

  var _ds = _getDataSource(entityCode)
  if (_ds) {
    var records = _ds.getAllRecords() && _ds.getAllRecords().toArray()
    var dates = []
    if (records && records.length > 0) {
      for (var i = 0; i < records.length; i++) {
        var record = records[i],
          value = record.get(fieldName)
        dates.push(value)
      }
      vds.widget.execute(widgetCode, 'selectCellByDate', [dates])
    } else {
      // 执行清空所有选中项
      vds.widget.execute(widgetCode, 'clearSelectedCell')
    }
  }
  return true
}

var exceptionHandler = function (message:string) {
  var exception = vds.exception.newConfigException(message)
  throw exception
}

var _getDataSource = function (dsName:string) {
  // 仅支持前台实体
  var datasource = vds.ds.lookup(dsName)
  return datasource
}
export { main }
