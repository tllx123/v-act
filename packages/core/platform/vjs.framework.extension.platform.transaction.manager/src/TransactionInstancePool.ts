let _pool = {}
let collectionUtil, objectUtil

export function initModule(sb) {
  collectionUtil = sb.util.collections
  objectUtil = sb.util.object
}

const put = function (transactionId, instance) {
  _pool[transactionId] = instance
}

const get = function (transactionId) {
  return _pool[transactionId]
}

const remove = function (transactionId) {
  _pool[transactionId] = null
  try {
    delete _pool[transactionId]
  } catch (e) {}
}

const getByScopeId = function (scopeId) {
  let result = []
  collectionUtil.each(_pool, function (instance) {
    let sId = instance.getScopeId()
    if (scopeId == sId) {
      result.push(instance)
    }
  })
  return result
}

const getAll = function () {
  return objectUtil.values(_pool)
}

export { add, put, get, remove, getByScopeId, getAll }
