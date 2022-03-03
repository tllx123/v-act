let StorageManager
let token = 'Platform_Icon_Data'
let sandbox
let loadedIconCodes = []

exports.initModule = function (sb) {
  if (sb) {
    sandbox = sb
    StorageManager = sb.getService(
      'vjs.framework.extension.platform.interface.storage.StorageManager'
    )
  }
}
let getStorage = function () {
  return StorageManager.get(StorageManager.TYPES.MAP, token)
}

const init = function (datas) {
  if (datas) {
    let storage = getStorage()
    for (let code in datas) {
      if (datas.hasOwnProperty(code)) {
        storage.put(code, datas[code])
      }
    }
  }
}

let exeFunc = function (func) {
  if (typeof func == 'function') {
    func()
  }
}

const loadIcons = function (params) {
  let iconCodes = params.iconCodes,
    callback = params.callback
  if (iconCodes && iconCodes.length > 0) {
    let loadIcons = []
    let iconPaths = []
    let storage = getStorage()
    for (let i = 0, len = iconCodes.length; i < len; i++) {
      let iconCode = iconCodes[i]
      if (
        loadedIconCodes.indexOf(iconCode) == -1 &&
        loadIcons.indexOf(iconCode) == -1
      ) {
        let path = storage.get(iconCode)
        if (null != path) {
          loadIcons.push(iconCode)
          iconPaths.push(path)
        }
      }
    }
    if (loadIcons.length > 0) {
      vdk.resource.add(
        new vdk.resource({
          id: loadIcons.join(','),
          paths: iconPaths
        })
      )
      vdk.resource.load(callback)
    } else {
      exeFunc(callback)
    }
  } else {
    exeFunc(callback)
  }
}

export {
  addRuleSetInputs,
  getRuleSetInputs,
  exists,
  getRuleSetInput,
  isAppConfigInfoLoaded,
  markAppConfigInfoLoaded,
  addComponentRouteInfo,
  getRouteConfig,
  addComponentVariantDefines,
  getComponentVariantDefine,
  addComponentOptionDefines,
  getComponentOptionDefine,
  destroy,
  componentIsLoaded,
  markForComponentLoaded,
  componentIsInited,
  markForComponentInited,
  setComponentType,
  getComponentType,
  init,
  existMapping,
  getMapping,
  init,
  loadIcons
}
