export function initModule(sb: any) {
  let dependency = sb.getService(
    'vjs.framework.extension.ui.adapter.resourcepackage'
  )
  dependency.putInstance(this)
}

let resourcePackagePool = {}

let resourceWindowPool = {}

let getValidLanguage = function (componentCode: string, resourceCode: string) {
  return resourceCode
}

let setWindowCurrentResourceCode = function (
  resourceCode: string,
  scopeId: string,
  componentCode: string
) {}

let getWindowCurrentResourceCode = function (scopeId: string) {
  return ''
}

let curResourcePackageCode

let getResourceItem = function (resourceCode: string, resourceType: string) {
  return ''
}

let getResourceItems = function (componentCode: string, resourceType: string) {
  return ''
}

let getLanguageItem = function (resourceCode: string) {
  return ''
}

let getLanguageItems = function (componentCode: string) {
  return ''
}

let getResItem = function (resourceCode: string) {
  return ''
}

let setResourcePool = function (pool: any, type: any) {}

export {
  getResItem,
  setResourcePool,
  getLanguageItem,
  getLanguageItems,
  setWindowCurrentResourceCode,
  getWindowCurrentResourceCode,
  getValidLanguage
}
