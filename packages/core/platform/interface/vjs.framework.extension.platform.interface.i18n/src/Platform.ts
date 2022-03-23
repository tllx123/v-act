let PLATFORM_POOL = {}

const init = function (params) {
  PLATFORM_POOL[params.vjsName] = params.items
}

const get = function (params, detail?: string) {
  if (params && params.defaultVal) {
    let vjsPool = PLATFORM_POOL[params.vjsName]
    if (vjsPool) {
      return vjsPool.hasOwnProperty(params.code)
        ? vjsPool[params.code]
        : params.defaultVal
    }
    return params.defaultVal
  } else {
    return params
  }
}

const has = function (params) {
  let vjsPool = PLATFORM_POOL[params.vjsName]
  let code = params.code
  if (vjsPool && vjsPool.hasOwnProperty(code)) {
    return true
  }
  return false
}

export {
  get,
  getExpLanguage,
  getResourcePackage,
  has,
  hasExpLanguage,
  hasResourcePackage,
  init,
  initExp,
  initResourcePackage
}
