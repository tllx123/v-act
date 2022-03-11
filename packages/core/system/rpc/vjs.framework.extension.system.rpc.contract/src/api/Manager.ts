let pool:{[code:string]:any} = {},
  objectUtils:any

export function initModule(sb:any) {
  objectUtils = sb.util.object
}

const injectCurrentContract = function (py:any, pros:any) {
  pool[pros] = py
}

const getCurrentContractService = function (pros:any) {
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
