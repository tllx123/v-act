/**
 * 将实体转换成变量字符串
 */
import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'

const vds = { ds, exception }

const main = function (str: string) {
  if (str) {
    let entities = str.split(',')
    let entitiesObj: Record<string, any> = {}
    for (let i = 0; i < entities.length; i++) {
      let entityName = entities[i]
      let tempDB = vds.ds.lookup(entityName)
      if (!tempDB) {
        throw vds.exception.newConfigException(
          '无法获取实体【' + entityName + '】, 请检查实体是否存在'
        )
      }
      let tempDBObj = tempDB.serialize()
      entitiesObj[entityName] = tempDBObj
    }
    let retVar = JSON.stringify(entitiesObj)
    return retVar
  }
}
export { main }
