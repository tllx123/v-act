import MapStorage from '../impl/MapStorage'
import TreeStorage from '../impl/TreeStorage'

const _storagePool: { [type: string]: { [token: string]: any } } = {}
/**
 * 数据仓库类型枚举
 * @enum {String}
 */
enum TYPES {
  /**树形仓库*/
  TREE = 'tree',
  /**Map型仓库*/
  MAP = 'map'
}

for (let type in TYPES) {
  _storagePool[TYPES[type]] = {}
}

const get = function (type: TYPES, token: string) {
  if (exists(type, token)) {
    let pool = _storagePool[type]
    return pool[token]
  } else {
    const constructor = type == TYPES.MAP ? MapStorage : TreeStorage
    const storage = new constructor()
    const pool = _storagePool[type]
    pool[token] = storage
    return storage
  }
}

const destory = function (type: TYPES, token: string) {
  if (contains(type, token)) {
    const pool = _storagePool[type]
    try {
      delete pool[token]
    } catch (e) {}
  }
}

const exists = function (type: TYPES, token: string) {
  const pool = _storagePool[type]
  if (pool) {
    return pool.hasOwnProperty(token)
  } else {
    throw Error(
      '[StorageManager.contains]未识别仓库类型[type=' + type + ']，请检查！'
    )
  }
}

const newInstance = function (type: TYPES) {
  const constructor = type == TYPES.MAP ? MapStorage : TreeStorage
  return new constructor()
}

export { destory, exists, get, newInstance, TYPES }
