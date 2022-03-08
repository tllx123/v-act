/**
 * 将实体转换成变量字符串
 */
import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
const vds = { ds, exception }

var main = function (str) {
  if (str) {
    var entities = str.split(',')
    var entitiesObj = {}
    for (var i = 0; i < entities.length; i++) {
      var entityName = entities[i]
      var tempDB = vds.ds.lookup(entityName)
      if (!tempDB) {
        throw vds.exception.newConfigException(
          '无法获取实体【' + entityName + '】, 请检查实体是否存在'
        )
      }
      var tempDBObj = tempDB.serialize()
      entitiesObj[entityName] = tempDBObj
    }
    var retVar = JSON.stringify(entitiesObj)
    return retVar
  }
}
export { main }
