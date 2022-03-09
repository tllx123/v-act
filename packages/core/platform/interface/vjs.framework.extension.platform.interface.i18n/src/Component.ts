let COMPONENT_RESOURCE_PACKAGE = {}

let COMPONENT_I18N = {}

let COMPONENT_EXP = {}

const initResourcePackage = function (params) {
  COMPONENT_RESOURCE_PACKAGE[params.componentCode] = params.items
}

const init = function (params) {
  COMPONENT_I18N[params.componentCode] = params.items
}

const initExp = function (params) {
  COMPONENT_EXP[params.componentCode] = params.items
}

const getResourcePackage = function (params) {
  let items = COMPONENT_RESOURCE_PACKAGE[params.componentCode]
  if (items) {
    return items[params.code] || ''
  }
  return ''
}

const getExpLanguage = function (params) {
  let items = COMPONENT_EXP[params.componentCode]
  if (items) {
    return items[params.code] || ''
  }
  return ''
}

const get = function (params) {
  let items = COMPONENT_I18N[params.componentCode]
  if (items) {
    return items[params.code] || params.defaultVal
  }
  return params.defaultVal
}

/**
 * 是否存在多语言数据
 * @params	obj		Object	多语言数据
 * @params	params	Object	参数信息
 * {
 * 		componentCode	:	String	构件编号，
 * 		code			:	String	多语言项编号
 * }
 * */
function exist(obj, params) {
  let componentCode = params.componentCode
  let code = params.code
  let items = obj[componentCode]
  if (items && items.hasOwnProperty(code)) {
    return true
  }
  return false
}

const hasResourcePackage = function (params) {
  return exist(COMPONENT_RESOURCE_PACKAGE, params)
}

const hasExpLanguage = function (params) {
  return exist(COMPONENT_EXP, params)
}

const has = function (params) {
  return exist(COMPONENT_I18N, params)
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
  has
}