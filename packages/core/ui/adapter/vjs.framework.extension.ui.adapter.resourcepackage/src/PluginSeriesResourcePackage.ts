let instance:any

const putInstance = function (ie:any) {
  instance = ie
}

let hasInstance = function () {
  if (instance) {
    return true
  }
  return false
}

const getResItem = function (resourceCode:string) {
  if (hasInstance()) {
    return instance.getResItem(resourceCode)
  } else {
    return ''
  }
}

const getLanguageItem = function (resourceCode:string) {
  if (hasInstance()) {
    return instance.getLanguageItem(resourceCode)
  } else {
    return ''
  }
}

const setResourcePool = function (pool:any, type:any) {
  if (hasInstance()) {
    instance.setResourcePool(pool, type)
  }
}

const getLanguageItems = function (componentCode:string) {
  if (hasInstance()) {
    return instance.getLanguageItems(componentCode)
  } else {
    return ''
  }
}

const setWindowCurrentResourceCode = function (
  newScopeId:string,
  preScopeId:string,
  componentCode:string,
  languageCode:string
) {
  if (hasInstance()) {
    instance.setWindowCurrentResourceCode(
      newScopeId,
      preScopeId,
      componentCode,
      languageCode
    )
  } else {
    return ''
  }
}

const getWindowCurrentResourceCode = function (scopeId:string) {
  if (hasInstance()) {
    return instance.getWindowCurrentResourceCode(scopeId)
  } else {
    return ''
  }
}

const getValidLanguage = function (componentCode:string, resourceCode:string) {
  if (hasInstance()) {
    return instance.getValidLanguage(componentCode, resourceCode)
  } else {
    return ''
  }
}

export {
  getLanguageItem,
  getLanguageItems,
  getResItem,
  getValidLanguage,
  getWindowCurrentResourceCode,
  putInstance,
  setResourcePool,
  setWindowCurrentResourceCode
}
