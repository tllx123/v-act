let PLATFORM_POOL = {}

const init = function (params: any) {
  PLATFORM_POOL[params.vjsName] = params.items
}

const get = function (
  params: string | { defaultVal: string; code?: string; vjsName: string },
  detail?: string
) {
  if (typeof params == 'object' && params.defaultVal) {
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

const has = function (params: any) {
  let vjsPool = PLATFORM_POOL[params.vjsName]
  let code = params.code
  if (vjsPool && vjsPool.hasOwnProperty(code)) {
    return true
  }
  return false
}

export {
  get,
  // getExpLanguage,
  // getResourcePackage,
  has,
  // hasExpLanguage,
  // hasResourcePackage,
  init
  // initExp,
  // initResourcePackage
}
