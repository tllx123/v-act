import { StorageManager } from '@v-act/vjs.framework.extension.platform.interface.storage'

let token = 'Platform_Icon_Data'
let loadedIconCodes: any = []

let getStorage = function () {
  return StorageManager.get(StorageManager.TYPES.MAP, token)
}

const init = function (datas: any) {
  if (datas) {
    let storage = getStorage()
    for (let code in datas) {
      if (datas.hasOwnProperty(code)) {
        storage.put(code, datas[code])
      }
    }
  }
}

let exeFunc = function (func: any) {
  if (typeof func == 'function') {
    func()
  }
}

const loadIcons = function (params: any) {
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
      //@ts-ignore
      vdk.resource.add(
        //@ts-ignore
        new vdk.resource({
          id: loadIcons.join(','),
          paths: iconPaths
        })
      )
      //@ts-ignore
      vdk.resource.load(callback)
    } else {
      exeFunc(callback)
    }
  } else {
    exeFunc(callback)
  }
}

export {
  //addComponentOptionDefines,
  //addComponentRouteInfo,
  //addComponentVariantDefines,
  //addRuleSetInputs,
  //componentIsInited,
  //componentIsLoaded,
  //destroy,
  //existMapping,
  //exists,
  //getComponentOptionDefine,
  //getComponentType,
  //getComponentVariantDefine,
  //getMapping,
  //getRouteConfig,
  //getRuleSetInput,
  //getRuleSetInputs,
  init,
  //isAppConfigInfoLoaded,
  loadIcons
  //markAppConfigInfoLoaded,
  //markForComponentInited,
  //markForComponentLoaded,
  //setComponentType
}
