let PLATFORM_POOL = {}

const init = function (params) {
  PLATFORM_POOL[params.vjsName] = params.items
}

const get = function (params) {
  let vjsPool = PLATFORM_POOL[params.vjsName]
  if (vjsPool) {
    return vjsPool.hasOwnProperty(params.code)
      ? vjsPool[params.code]
      : params.defaultVal
  }
  return params.defaultVal
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
  initResourcePackage,
  init,
  initExp,
  getResourcePackage,
  getExpLanguage,
  get,
  hasResourcePackage,
  hasExpLanguage,
  has,
  init,
  get,
  has
}
