let storageManager,
  ParamConfigFactory,
  sandbox,
  token = 'WindowParam_Token_Key',
  input_param_token = 'WindowParam_Input_Token_Key',
  output_param_token = 'WindowParam_Output_Token_Key'

exports.initModule = function (sb) {
  if (sb) {
    storageManager = sb.getService(
      'vjs.framework.extension.platform.interface.storage.StorageManager'
    )
    ParamConfigFactory = sb.getService(
      'vjs.framework.extension.platform.interface.model.config.ParamConfigFactory'
    )
    sandbox = sb
  }
}

let getWindowStorage = function (depth, isCreate) {
  let rs,
    s = storageManager.get(storageManager.TYPES.MAP, token)
  for (let i = 0, key; (key = depth[i]); i++) {
    if (s.containsKey(key)) {
      rs = s = s.get(key)
    } else if (isCreate) {
      rs = storageManager.newInstance(storageManager.TYPES.MAP)
      s.put(key, rs)
      s = rs
    } else {
      return null
    }
  }
  return rs
}

let addWindowDefines = function (componentCode, windowCode, domain, defines) {
  let wStorage = getWindowStorage([componentCode, windowCode, domain], true)
  let params = ParamConfigFactory.unSerialize(defines)
  if (params) {
    sandbox.util.collections.each(params, function (param) {
      wStorage.put(param.getCode(), param)
    })
  }
}

let getWindowDefine = function (componentCode, windowCode, domain, code) {
  let wStorage = getWindowStorage([componentCode, windowCode, domain], false)
  return wStorage ? wStorage.get(code) : null
}

let getAllDefines = function (componentCode, windowCode, domain) {
  let wStorage = getWindowStorage([componentCode, windowCode, domain], false)
  let defines = []
  if (wStorage) {
    wStorage.iterate(function (code, define) {
      defines.push(define)
    })
  }
  return defines
}

const addInputDefines = function (
  componentCode: string,
  windowCode: string,
  defines
) {
  addWindowDefines(componentCode, windowCode, input_param_token, defines)
}

const addOutputDefines = function (
  componentCode: string,
  windowCode: string,
  defines
) {
  addWindowDefines(componentCode, windowCode, output_param_token, defines)
}

const getInputDefine = function (
  componentCode: string,
  windowCode: string,
  code: string
) {
  return getWindowDefine(componentCode, windowCode, input_param_token, code)
}

const getOutputDefine = function (
  componentCode: string,
  windowCode: string,
  code: string
) {
  return getWindowDefine(componentCode, windowCode, output_param_token, code)
}

const getOutputDefines = function (componentCode: string, windowCode: string) {
  return getAllDefines(componentCode, windowCode, output_param_token)
}

const getInputDefines = function (componentCode: string, windowCode: string) {
  return getAllDefines(componentCode, windowCode, input_param_token)
}

export {
  addComponentResource,
  addInputDefines,
  addOptionDefines,
  addOutputDefines,
  addRuleSetInputs,
  addVariantDefines,
  exists,
  existWindowMapping,
  getComponentResourcePath,
  getComponentResourcePaths,
  getInputDefine,
  getInputDefines,
  getMetadata,
  getOptionDefine,
  getOptionDefines,
  getOutputDefine,
  getOutputDefines,
  getRuleSetInput,
  getRuleSetInputs,
  getVariantDefine,
  getVariantDefines,
  getWindowMapping,
  initWindowMapping,
  registerMetadata
}
