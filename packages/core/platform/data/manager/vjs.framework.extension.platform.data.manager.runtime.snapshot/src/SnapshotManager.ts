import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { StorageManager as storageManager } from '@v-act/vjs.framework.extension.platform.interface.storage'

import * as snapshotFactory from './SnapshotFactory'

let stack = [],
  token = 'WINDOW_RUNTIME_SNAPSHOT'

let _getStorage = function () {
  let scope = scopeManager.getWindowScope()
  if (!scope) return null
  if (scope.has(token)) {
    return scope.get(token)
  } else {
    let storage = storageManager.newInstance(storageManager.TYPES.MAP)
    scope.set(token, storage)
    return storage
  }
}

const takeSnapshot = function () {
  if (stack.length != 0) {
    return stack[stack.length - 1]
  } else {
    let snapshot = snapshotFactory.create()
    let storage = _getStorage()
    if (storage) {
      let id = snapshot.getId()
      storage.put(id, snapshot)
      return id
    }
  }
  return null
}

const begine = function (snapshotId) {
  stack.push(snapshotId)
}

const end = function () {
  if (stack.length > 0) {
    stack.pop()
  }
}

const clear = function (snapshotId) {
  let storage = _getStorage()
  if (storage) {
    storage.remove(snapshotId)
  }
}

const getCurrentSnapshot = function () {
  if (stack.length > 0) {
    let snapshotId = stack[stack.length - 1]
    let storage = _getStorage()
    return storage && storage.get(snapshotId)
  }
  return null
}

export { begine, clear, create, end, getCurrentSnapshot, takeSnapshot }
