import { WindowDatasource as windowDatasource } from '@v-act/vjs.framework.extension.platform.data.manager.runtime.datasource'

import DatasourceSnapshot from './DatasourceSnapshot'
import Snapshot from './Snapshot'

const create = function () {
  // @ts-ignore
  let snapshot = new Snapshot()
  let datasources = windowDatasource.getAll()
  for (let i = 0, l = datasources.length; i < l; i++) {
    let ds = datasources[i]
    // @ts-ignore
    let dsSnapshot = new DatasourceSnapshot(ds)
    snapshot.registerDatsourceSnapshot(ds.getInstanceId(), dsSnapshot)
  }
  return snapshot
}

export { create }
