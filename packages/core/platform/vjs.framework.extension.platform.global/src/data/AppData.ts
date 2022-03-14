import { ParamConfigFactory } from '@v-act/vjs.framework.extension.platform.interface.model.config'
import { StorageManager } from '@v-act/vjs.framework.extension.platform.interface.storage'

let keys = {
  WindowInputs: 'WindowInputs'
}

let tokenPrefix = 'AppData_'

let isAppConfigInfoLoadedFlag = false

const addRuleSetInputs = function (
  componentCode,
  windowCode,
  metaCode,
  inputs
) {
  let params = ParamConfigFactory.unSerialize(inputs)
  let token = generateToken(componentCode, windowCode, metaCode)
  let storage = StorageManager.get(StorageManager.TYPES.MAP, token)
  storage.put(keys.WindowInputs, params)
}

let generateToken = function (componentCode, windowCode, metaCode) {
  return tokenPrefix + componentCode + '_' + windowCode + '_' + metaCode
}

const getRuleSetInputs = function (componentCode, windowCode, metaCode) {
  let token = generateToken(componentCode, windowCode, metaCode)
  if (StorageManager.exists(StorageManager.TYPES.MAP, token)) {
    let storage = StorageManager.get(StorageManager.TYPES.MAP, token)
    return storage.get(keys.WindowInputs)
  }
  return null
}

const exists = function (componentCode, windowCode, metaCode) {
  let token = generateToken(componentCode, windowCode, metaCode)
  if (StorageManager.exists(StorageManager.TYPES.MAP, token)) {
    let storage = StorageManager.get(StorageManager.TYPES.MAP, token)
    return storage.containsKey(keys.WindowInputs)
  }
  return false
}

const getRuleSetInput = function (
  componentCode,
  windowCode,
  metaCode,
  paramCode
) {
  let inputs = getRuleSetInputs(componentCode, windowCode, metaCode)
  if (inputs) {
    for (let i = 0; i < inputs.length; i++) {
      let input = inputs[i]
      if (input.code == paramCode) {
        return input
      }
    }
  }
  return null
}

const isAppConfigInfoLoaded = function () {
  return isAppConfigInfoLoadedFlag
}

const markAppConfigInfoLoaded = function () {
  isAppConfigInfoLoadedFlag = true
}

export {
  addRuleSetInputs,
  exists,
  getRuleSetInput,
  getRuleSetInputs,
  isAppConfigInfoLoaded,
  markAppConfigInfoLoaded
}
