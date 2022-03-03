import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util'
import { DatasourceManager as dbManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
let undefined
exports.initModule = function (sb) {}

// 主入口(必须有)
let main = function (param) {
  let args = param.getArgs()
  let str = args[0]
  if (str) {
    let entities = str.split(',')
    let entitiesObj = {}
    for (let i = 0; i < entities.length; i++) {
      let entityName = entities[i]
      let tempDB = dbManager.lookup({
        datasourceName: entityName
      })
      let tempDBObj = tempDB.serialize()
      entitiesObj[entityName] = tempDBObj
    }
    let retVar = jsonUtil.obj2json(entitiesObj)
    return retVar
  }
}
export { main }
