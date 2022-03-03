let _storagePool = {}

let _constuctorMap = {}

let inited = false

exports.initModule = function () {
  _init()
}

let _init = function () {
  if (!inited) {
    let TreeStorage = require('vjs/framework/extension/platform/interface/storage/impl/TreeStorage')
    let MapStorage = require('vjs/framework/extension/platform/interface/storage/impl/MapStorage')
    _constuctorMap[exports.TYPES.TREE] = TreeStorage
    _constuctorMap[exports.TYPES.MAP] = MapStorage
    for (let type in exports.TYPES) {
      _storagePool[exports.TYPES[type]] = {}
    }
    inited = true
  }
}

const get = function (type, token) {
  _init()
  if (exports.exists(type, token)) {
    let pool = _storagePool[type]
    return pool[token]
  } else {
    let constructor = _constuctorMap[type]
    let storage = new constructor()
    let pool = _storagePool[type]
    pool[token] = storage
    return storage
  }
}

const destory = function (type, token) {
  if (exports.contains(type, token)) {
    let pool = _storagePool[type]
    try {
      delete pool[token]
    } catch (e) {}
  }
}

const exists = function (type, token) {
  let pool = _storagePool[type]
  if (pool) {
    return pool.hasOwnProperty(token)
  } else {
    throw Error(
      '[StorageManager.contains]未识别仓库类型[type=' + type + ']，请检查！'
    )
  }
}

const newInstance = function (type) {
  _init()
  let constructor = _constuctorMap[type]
  return new constructor()
}

/**
 * 数据仓库类型枚举
 * @enum {String}
 */
exports.TYPES = {
  /**树形仓库*/
  TREE: 'tree',
  /**Map型仓库*/
  MAP: 'map'
}

export { get, destory, exists, newInstance }
