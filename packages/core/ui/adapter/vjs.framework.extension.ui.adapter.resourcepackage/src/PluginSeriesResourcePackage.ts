let instance

const putInstance = function (ie) {
  instance = ie
}

let hasInstance = function () {
  if (instance) {
    return true
  }
  return false
}

const getResItem = function (resourceCode) {
  if (hasInstance()) {
    return instance.getResItem(resourceCode)
  } else {
    return ''
  }
}

const getLanguageItem = function (resourceCode) {
  if (hasInstance()) {
    return instance.getLanguageItem(resourceCode)
  } else {
    return ''
  }
}

const setResourcePool = function (pool, type) {
  if (hasInstance()) {
    instance.setResourcePool(pool, type)
  }
}

const getLanguageItems = function (componentCode) {
  if (hasInstance()) {
    return instance.getLanguageItems(componentCode)
  } else {
    return ''
  }
}

const setWindowCurrentResourceCode = function (
  newScopeId,
  preScopeId,
  componentCode,
  languageCode
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

const getWindowCurrentResourceCode = function (scopeId) {
  if (hasInstance()) {
    return instance.getWindowCurrentResourceCode(scopeId)
  } else {
    return ''
  }
}

const getValidLanguage = function (componentCode, resourceCode) {
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
