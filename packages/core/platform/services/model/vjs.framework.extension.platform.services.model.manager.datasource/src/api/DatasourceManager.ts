import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { WindowDatasource as datasourceManager } from '@v-act/vjs.framework.extension.platform.data.manager.runtime.datasource'
import { WindowVMMappingManager as vmmappingManager } from '@v-act/vjs.framework.extension.platform.services.vmmapping.manager'

let undefined

exports.initModule = function (sBox) {}

let _getManager = function () {
  return datasourceManager
}

const register = function (params) {
  let manager = _getManager()
  manager.register(params)
}

const unRegister = function (params) {
  let manager = _getManager()
  manager.unRegister(params)
}

const lookup = function (params) {
  let manager = _getManager()
  return manager.lookup(params)
}

const exists = function (params) {
  let manager = _getManager()
  return manager.exists(params)
}

const getAll = function () {
  let manager = _getManager()
  return manager.getAll()
}

const getAllWithoutVir = function () {
  let manager = _getManager()
  let result = manager.getAll()
  let rs = []
  for (let i = 0, ds; (ds = result[i]); i++) {
    let md = ds.getMetadata()
    let name = md.getDatasourceName()
    if (!vmmappingManager.isVirtualDataSource({ datasourceName: name })) {
      rs.push(ds)
    }
  }
  return rs
}

export { register, unRegister, lookup, exists, getAll, getAllWithoutVir }
