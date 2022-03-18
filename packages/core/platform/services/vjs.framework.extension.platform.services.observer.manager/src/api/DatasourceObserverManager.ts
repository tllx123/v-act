import { DatasourceObserverManager as manager } from '@v-act/vjs.framework.extension.platform.data.manager.runtime.observer'

export function initModule(sb) {}

const addObserver = function (params: any) {
  return manager.addObserver(params.observer)
}

const destroy = function (params: any) {
  manager.destroy(params.ids)
}

export { addObserver, destroy }
