let pool = {},
  objectUtils

exports.initModule = function (sb) {
  objectUtils = sb.util.object
}

const injectCurrentContract = function (py, pros) {
  pool[pros] = py
}

const getCurrentContractService = function (pros) {
  let type = typeof pros
  if (type == 'string' || pros === null) {
    return pool[pros]
  } else if (type == 'object') {
    for (let p in pool) {
      if (objectUtils.isEqual(p, pros)) {
        return pool[p]
      }
    }
  }
  return null
}

export { injectCurrentContract, getCurrentContractService }
