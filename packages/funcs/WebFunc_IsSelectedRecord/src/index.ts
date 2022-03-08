/**
 *  判断记录是否选中
 *  代码示例:
 *  IsSelectedRecord("book","name","数据")
 *  返回值为：true
 *  参数数量:3
 *  参数1：实体编码,必填
    参数2：字段编码,必填
    参数3：字段值,必填
 *  
 *  返回值为布尔类型
 */
import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
const vds = { ds, exception, object }

var main = function (entityCode, fieldCode, fieldValue) {
  if (vds.object.isUndefOrNull(entityCode)) {
    var exception =
      vds.exception.newConfigException('函数第一个参数,实体编码不能为空!')
    throw exception
  }
  if (vds.object.isUndefOrNull(fieldCode)) {
    var exception =
      vds.exception.newConfigException('函数第二个参数,字段编码不能为空!')
    throw exception
  }
  if (vds.object.isUndefOrNull(fieldValue)) {
    var exception =
      vds.exception.newConfigException('函数第三个参数,字段值不能为空!')
    throw exception
  }
  var datasource = vds.ds.lookup(entityCode)
  if (vds.object.isUndefOrNull(datasource)) {
    var exception = vds.exception.newConfigException('实体不存在，请重新配置!')
    throw exception
  }
  //判断字段是否存在
  var fields = datasource.getMetadata().getFields()
  var isField = false
  for (var i = 0; i < fields.length; i++) {
    var entityField = fields[i].getCode()
    if (entityField == fieldCode) {
      isField = true
      break
    }
  }
  if (!isField) {
    var exception =
      vds.exception.newConfigException('实体字段不存在，请重新配置!')
    throw exception
  }
  //根据条件获取记录数
  var querycondition = vds.ds.createCriteria()
  var criteriaS = querycondition.sw(fieldCode, fieldValue)
  var returnvalue = false
  var records = datasource.queryRecord(criteriaS)
  records = records.toArray()
  for (var rIndex = 0; rIndex < records.length; rIndex++) {
    var selRecord = records[rIndex]
    var isSelected = datasource.isSelectedRecord(selRecord)
    if (isSelected) {
      returnvalue = true
      break
    }
  }
  return returnvalue
}
export { main }
