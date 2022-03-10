import { WindowMappingManager as windowMappingManager } from '@v-act/vjs.framework.extension.platform.data.manager.runtime.window.mapping'
import { WindowParam as schemaWinParam } from '@v-act/vjs.framework.extension.platform.data.storage.schema.param'
import { DatasourceFactory as datasourceFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { StorageManager as storageManager } from '@v-act/vjs.framework.extension.platform.interface.storage'

let storageToken = 'STORAGE_RUNTIME_PARAM_WINDOWPARAM',
  inputToken = 'RUNTIME_WINDOW_INPUT',
  outputToken = 'RUNTIME_WINDOW_OUTPUT'

export function initModule(sb) {}
let _getWindowScope = function () {
  let scope = scopeManager.getWindowScope()
  return scope
}
let getStorage = function (depth, isCreate) {
  let storage
  let scope = scopeManager.getScope()
  if (scope.has(storageToken)) {
    storage = scope.get(storageToken)
  } else {
    storage = storageManager.newInstance(storageManager.TYPES.MAP)
    scope.set(storageToken, storage)
  }
  let rs,
    s = storage
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

let _getDepth = function (depth) {
  let scope = _getWindowScope()
  let array = [scope.getComponentCode(), scope.getWindowCode()]
  return array.concat(depth)
}

let _putCode = function (code, value, fn) {
  let scope = _getWindowScope()
  let define = fn(scope.getComponentCode(), scope.getWindowCode(), code)
  if (define && define.getType() == 'entity') {
    //如果为实体变量,则将实体名称设置为变量名称(需求来源:当通过表达式过滤实体变量中字段值时,需要使用到数据源名称)
    let metadata = value.getMetadata()
    metadata.setDatasourceName(code)
  }
}

let _getCode = function (code, type, scopeId) {
  let scope = scopeId
    ? scopeManager.getScope(scopeId)
    : scopeManager.getWindowScope()
  if (code && type) {
    let params = {
      componentCode: scope.getComponentCode(),
      windowCode: scope.getWindowCode()
    }
    let result
    switch (type) {
      case 'input':
        params.inputCode = code
        result = windowMappingManager.getInput(params)
        break
      case 'output':
        params.outputCode = code
        result = windowMappingManager.getOutput(params)
        break
    }
    if (result) {
      return result
    }
  }
  return code
}

const setInput = function (_code, value) {
  let code = _getCode(_code, 'input')
  let depth = _getDepth([inputToken])
  let storage = getStorage(depth, true)
  _putCode(code, value, schemaWinParam.getInputDefine)
  storage.put(code, value)
}

const getInput = function (_code) {
  let code = _getCode(_code, 'output')
  let depth = _getDepth([inputToken])
  let storage = getStorage(depth, true)
  return storage.get(code)
}

const getInputs = function () {
  let depth = _getDepth([inputToken])
  let storage = getStorage(depth, true)
  return storage.getAll()
}

const existsInput = function (_code) {
  let code = _getCode(_code, 'input')
  let depth = _getDepth([inputToken])
  let storage = getStorage(depth, true)
  return storage.containsKey(code)
}

const setOutput = function (_code, value) {
  let code = _getCode(_code, 'output')
  let depth = _getDepth([outputToken])
  let storage = getStorage(depth, true)
  _putCode(code, value, schemaWinParam.getOutputDefine)
  storage.put(code, value)
}

const getOutput = function (_code) {
  let code = _getCode(_code, 'output')
  let depth = _getDepth([outputToken])
  let storage = getStorage(depth, true)
  return storage.get(code)
}

const getOutputs = function () {
  let depth = _getDepth([outputToken])
  let storage = getStorage(depth, true)
  return storage.getAll()
}

const existsOutput = function (_code) {
  let code = _getCode(_code, 'output')
  let depth = _getDepth([outputToken])
  let storage = getStorage(depth, true)
  return storage.containsKey(code)
}

const initInputs = function (inputParam) {
  if (inputParam) {
    let variable = inputParam['variable']
    if (variable) {
      let scope = scopeManager.getWindowScope()
      let windowCode = scope.getWindowCode(),
        componentCode = scope.getComponentCode()
      for (let name in variable) {
        let val = variable[name]
        let define = schemaWinParam.getInputDefine(
          componentCode,
          windowCode,
          name
        )
        if (define) {
          let type = define.getType()
          if (type == 'entity') {
            if (arrayUtil.isArray(val)) {
              //支持实体数据
              let fields = []
              let cfgs = define.getConfigs()
              if (cfgs && cfgs.length) {
                for (let i = 0, l = cfgs.length; i < l; i++) {
                  let cfg = cfgs[i]
                  fields.push({
                    code: cfg.getCode(),
                    name: cfg.getName(),
                    type: cfg.getType(),
                    defaultValue: cfg.getInitValue()
                  })
                }
              }
              val = datasourceFactory.createJsonFromConfig({
                datas: val,
                fields: fields
              })
              val = datasourceFactory.unSerialize(val)
            } else if (!datasourceFactory.isDatasource(val)) {
              val = datasourceFactory.unSerialize(val)
            }
          }
        }
        setInput(name, val)
      }
    }
  }
}

export {
  existsInput,
  existsOption,
  existsOutput,
  existsVariant,
  getInput,
  getInputs,
  getOption,
  getOutput,
  getOutputs,
  getVariant,
  initInputs,
  isVariantInited,
  markVariantInited,
  setInput,
  setOutput,
  setVariant
}
