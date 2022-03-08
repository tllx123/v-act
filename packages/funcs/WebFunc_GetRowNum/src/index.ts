import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as expression from '@v-act/vjs.framework.extension.platform.services.integration.vds.expression'
/**
 *	根据id获取实体行号,1,2,3,4,5,6,7......
 *	参数  实体名称，id
 *  返回  行号
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'

const vds = { object, expression, ds, exception }

const main = function (dsName, id) {
  if (vds.object.isUndefOrNull(dsName)) {
    throw vds.exception.newConfigException('参数1-实体编码不能为空')
  }
  if (vds.object.isUndefOrNull(id)) {
    throw vds.exception.newConfigException('参数2-记录id不能为空')
  }
  //...
  //根据参数实现函数处理逻辑
  //todo:
  var datasource = null
  //
  if (vds.ds.isDatasource(dsName)) {
    datasource = dsName
  } else {
    if (dsName.indexOf('.') == -1 && dsName.indexOf('@') == -1) {
      datasource = vds.ds.lookup(dsName)
    } else {
      datasource = vds.expression.execute(dsName)
    }
  }
  //		id= vds.expression.execute(id);
  if (!datasource)
    throw vds.exception.newConfigException(
      '无法获取实体【' + dsName + '】, 请检查实体是否存在'
    )
  var records = datasource.getAllRecords().toArray()
  if (records && records.length > 0) {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i]
      if (record.get('id') == id) {
        return i + 1
      }
    }
  }
  return -1
}
export { main }
