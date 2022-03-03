import { WindowDatasource as windowDatasource } from '@v-act/vjs.framework.extension.platform.data.manager.runtime.datasource'
import * as Snapshot from './Snapshot'
import * as DatasourceSnapshot from './DatasourceSnapshot'

let undefined

exports.initModule = function (sb) {}

const create = function () {
  let snapshot = new Snapshot()
  let datasources = windowDatasource.getAll()
  for (let i = 0, l = datasources.length; i < l; i++) {
    let ds = datasources[i]
    let dsSnapshot = new DatasourceSnapshot(ds)
    snapshot.registerDatsourceSnapshot(ds.getInstanceId(), dsSnapshot)
  }
  return snapshot
}

export { create }
