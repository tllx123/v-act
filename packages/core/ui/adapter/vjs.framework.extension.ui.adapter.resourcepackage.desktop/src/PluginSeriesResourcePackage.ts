exports.initModule = function (sb) {
  let dependency = sb.getService(
    'vjs.framework.extension.ui.adapter.resourcepackage'
  )
  dependency.putInstance(exports)
}

let resourcePackagePool = {}

let resourceWindowPool = {}

let getValidLanguage = function (componentCode, resourceCode) {
  return resourceCode
}

let setWindowCurrentResourceCode = function (
  resourceCode,
  scopeId,
  componentCode
) {}

let getWindowCurrentResourceCode = function (scopeId) {
  return ''
}

let curResourcePackageCode

let getResourceItem = function (resourceCode, resourceType) {
  return ''
}

let getResourceItems = function (componentCode, resourceType) {
  return ''
}

let getLanguageItem = function (resourceCode) {
  return ''
}

let getLanguageItems = function (componentCode) {
  return ''
}

let getResItem = function (resourceCode) {
  return ''
}

let setResourcePool = function (pool, type) {}

export {
  getResItem,
  getLanguageItem,
  setResourcePool,
  getLanguageItem,
  getLanguageItems,
  setWindowCurrentResourceCode,
  getWindowCurrentResourceCode,
  getValidLanguage
}
