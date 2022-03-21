let _pool: { [code: string]: any } = {}
let collectionUtil: any, objectUtil: any

export function initModule(sb: any) {
  collectionUtil = sb.util.collections
  objectUtil = sb.util.object
}

const put = function (transactionId: string, instance: any) {
  _pool[transactionId] = instance
}

const get = function (transactionId: string) {
  return _pool[transactionId]
}

const remove = function (transactionId: string) {
  _pool[transactionId] = null
  try {
    delete _pool[transactionId]
  } catch (e) {}
}

const getByScopeId = function (scopeId: string) {
  let result: any = []
  collectionUtil.each(_pool, function (instance: any) {
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

export { put, get, remove, getByScopeId, getAll }
