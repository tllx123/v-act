import {
  ScopeTask,
  TaskManager as taskManager
} from '@v-act/vjs.framework.extension.platform.global'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { StorageManager as storageManager } from '@v-act/vjs.framework.extension.platform.interface.storage'

import * as observerManager from '../api/DatasourceObserverManager'
import * as DatasourceObserver from '../impl/DatasourceObserver'
import * as operationFactory from '../impl/OperationFactory'

let token = 'WINDOW_INSTANCE_OBSERVER_COMBINE_STORAGE'

let observerTask = {}

export function initModule(sb) {}

let getDatasourceObserver = function (datasourceName) {
  let scope = scopeManager.getWindowScope()
  let storage
  if (scope.has(token)) {
    storage = scope.get(token)
  } else {
    storage = storageManager.newInstance(storageManager.TYPES.MAP)
    scope.set(token, storage)
  }
  if (storage.containsKey(datasourceName)) {
    return storage.get(datasourceName)
  } else {
    let observer = new DatasourceObserver(datasourceName)
    storage.put(datasourceName, observer)
    return observer
  }
}

let getAll = function () {
  let scope = scopeManager.getWindowScope()
  let storage = scope.get(token)
  let rs = []
  if (storage) {
    storage.iterate(function (key, val) {
      rs.push(val)
    })
  }
  return rs
}

let apply = function () {
  let scopeId = getScopeId()
  delete observerTask[scopeId]
  let observers = getAll()
  for (let i = 0, len = observers.length; i < len; i++) {
    let observer = observers[i]
    observer.combine()
    let operations = observer.getOperations()
    observer.clear()
    for (let j = 0, l = operations.length; j < l; j++) {
      observerManager._callAsyncObservers(operations[j].getParams())
    }
  }
}

let getScopeId = function () {
  let scope = scopeManager.getWindowScope()
  return scope.getInstanceId()
}

let addObserverTask = function () {
  let instanceId = getScopeId()
  if (!observerTask.hasOwnProperty(instanceId)) {
    let scopeTask = new ScopeTask(instanceId, true, apply)
    taskManager.addTask(scopeTask)
    observerTask[instanceId] = true
  }
}

const addOperation = function (params) {
  let operation = operationFactory.create(params)
  let ds = params.datasource
  let metadata = ds.getMetadata()
  let dsName = metadata.getDatasourceName()
  let observer = getDatasourceObserver(dsName)
  observer.addOperation(operation)
  addObserverTask()
}

export {
  _callAsyncObservers,
  addObserver,
  addOperation,
  destroy,
  fire,
  getBindedDatasourceNames
}
