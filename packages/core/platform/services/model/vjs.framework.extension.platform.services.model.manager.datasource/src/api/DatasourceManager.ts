import { WindowDatasource as datasourceManager } from '@v-act/vjs.framework.extension.platform.data.manager.runtime.datasource'
// import {
//   WindowVMMappingManager
// } from '@v-act/vjs.framework.extension.platform.services.vmmapping.manager'
import { isVirtualDataSource } from '@v-act/vjs.framework.extension.platform.services.vmmapping.manager'

// export function initModule(sBox) {}

let _getManager = function () {
  return datasourceManager
}

const register = function (params: any) {
  let manager = _getManager()
  manager.register(params)
}

const unRegister = function (params: any) {
  let manager = _getManager()
  manager.unRegister(params)
}

const lookup = function (params: any) {
  let manager = _getManager()
  return manager.lookup(params)
}

const exists = function (params: any) {
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
    if (!isVirtualDataSource({ datasourceName: name })) {
      rs.push(ds)
    }
  }
  return rs
}

export { exists, getAll, getAllWithoutVir, lookup, register, unRegister }
