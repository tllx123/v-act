import { StorageManager as storageManager } from '@v-act/vjs.framework.extension.platform.interface.storage'

let storageToken = 'STORAGE_RUNTIME_PARAM_COMPONENTPARAM',
  variantToken = 'RUNTIME_COMPONENT_VARIANT',
  optionToken = 'RUNTIME_COMPONENT_OPTION',
  initedToken = 'RUNTIME_COMPONENT_INITED'

export function initModule(sb) {}

let getStorage = function (depth, isCreate) {
  let rs,
    s = storageManager.get(storageManager.TYPES.MAP, storageToken)
  for (let i = 0, key; (key = depth[i]); i++) {
    if (s.containsKey(key)) {
      rs = s = s.get(key)
    } else if (isCreate) {
      rs = storageManager.newInstance(storageManager.TYPES.MAP)
      s.put(key, rs)
      s = rs
    }
  }
  return rs
}

const setVariant = function (componentCode, variantCode, variantValue) {
  let storage = getStorage([variantToken, componentCode], true)
  storage.put(variantCode, variantValue)
}

const existsVariant = function (componentCode, variantCode) {
  let storage = getStorage([variantToken, componentCode], true)
  return storage.containsKey(variantCode)
}

const getVariant = function (componentCode, variantCode) {
  let storage = getStorage([variantToken, componentCode], true)
  return storage.get(variantCode)
}

const getOption = function (componentCode, optionCode) {
  let storage = getStorage([optionToken, componentCode], true)
  return storage.get(optionCode)
}

const existsOption = function (componentCode, optionCode) {
  let storage = getStorage([optionToken, componentCode], true)
  return storage.containsKey(optionCode)
}

const markVariantInited = function (componentCode) {
  let storage = getStorage([initedToken], true)
  storage.put(componentCode, true)
}

const isVariantInited = function (componentCode) {
  let storage = getStorage([initedToken], true)
  return storage.containsKey(componentCode)
}

export {
  setVariant,
  existsVariant,
  getVariant,
  getOption,
  existsOption,
  markVariantInited,
  isVariantInited
}
