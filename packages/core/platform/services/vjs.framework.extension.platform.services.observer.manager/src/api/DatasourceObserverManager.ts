import { DatasourceObserverManager as manager } from '@v-act/vjs.framework.extension.platform.data.manager.runtime.observer'

let undefined

exports.initModule = function (sb) {}

const addObserver = function (params) {
  return manager.addObserver(params.observer)
}

const destroy = function (params) {
  manager.destroy(params.ids)
}

export { addObserver, destroy }
