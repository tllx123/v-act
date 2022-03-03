import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { StorageManager as storageManager } from '@v-act/vjs.framework.extension.platform.interface.storage'
import { UUID as uuid } from '@v-act/vjs.framework.extension.util'
import { ArrayUtil as arrayUtil } from '@v-act/vjs.framework.extension.util'
import * as datasourceOperationManager from './api/DatasourceOperationManager'
import { WindowMappingManager as windowMappingManager } from '@v-act/vjs.framework.extension.platform.data.manager.runtime.window.mapping'

let storageToken = 'WINDOW_INSTANCE_OBSERVER_STORAGE',
  token = 'WINDOW_INSTANCE_OBSERVER'

let AsyncKey = 'async'
let NotAsyncKey = 'notasync'
let undefined

let _combineOperation = true

exports.initModule = function (sb) {}

let _getObserverStorage = function () {
  let scope = scopeManager.getScope()
  let storage
  if (scope.has(storageToken)) {
    storage = scope.get(storageToken)
  } else {
    storage = storageManager.newInstance(storageManager.TYPES.MAP)
    scope.set(storageToken, storage)
  }
  return storage
}

const addObserver = function (observer) {
  let dsName = observer.getDatasourceName()
  let scopeId = windowMappingManager.getScopeId(dsName)
  let id = uuid.generate()
  scopeManager.createScopeHandler({
    scopeId: scopeId,
    handler: function () {
      var storage = _getObserverStorage()
      observer.setInstanceId(id)
      //是否是异步观察者
      var isAsync = observer.isAsync()
      var observers = storage.get(dsName)
      if (storage.containsKey(dsName)) {
        observers = storage.get(dsName)
      } else {
        observers = {}
        observers[AsyncKey] = []
        observers[NotAsyncKey] = []
        storage.put(dsName, observers)
      }
      if (isAsync) {
        observers[AsyncKey].push(observer)
      } else {
        observers[NotAsyncKey].push(observer)
      }
    }
  })()
  //observers.push(observer);
  return id
}

const fire = function (params) {
  if (_combineOperation) {
    datasourceOperationManager.addOperation(params)
    let storage = _getObserverStorage()
    let ds = params.datasource
    let metadata = ds.getMetadata()
    let dsName = metadata.getDatasourceName()
    if (storage.containsKey(dsName)) {
      let observers = storage.get(dsName)
      let notAsync = observers[NotAsyncKey]
      for (let i = 0, observer; (observer = notAsync[i]); i++) {
        observer.fire(params)
      }
    }
  } else {
    this._callAsyncObservers(params)
  }
}

const _callAsyncObservers = function (params) {
  let storage = _getObserverStorage()
  let ds = params.datasource
  let metadata = ds.getMetadata()
  let dsName = metadata.getDatasourceName()
  if (storage.containsKey(dsName)) {
    let observers = storage.get(dsName)
    let asyncObservers = observers[AsyncKey]
    for (let i = 0, observer; (observer = asyncObservers[i]); i++) {
      observer.fire(params)
    }
  }
}

const getBindedDatasourceNames = function () {
  let storage = _getObserverStorage()
  let rs = []
  storage.iterate(function (dsName, observers) {
    rs.push(dsName)
  })
  return rs
}

const destroy = function (ids) {
  let storage = _getObserverStorage()
  for (let i = 0, l = ids.length; i < l; i++) {
    storage.iterate(function (key, val) {
      let asyncData = val[AsyncKey]
      for (j = 0; j < asyncData.length; j++) {
        if (ids[i] == asyncData[j].getInstanceId()) {
          arrayUtil.remove(asyncData, asyncData[j])
        }
      }
      let notAsync = val[NotAsyncKey]
      for (j = 0; j < notAsync.length; j++) {
        if (ids[i] == notAsync[j].getInstanceId()) {
          arrayUtil.remove(notAsync, notAsync[j])
        }
      }
    })
  }
}

export {
  addObserver,
  fire,
  _callAsyncObservers,
  getBindedDatasourceNames,
  destroy
}
