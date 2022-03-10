import { WindowParam as windowParam } from '@v-act/vjs.framework.extension.platform.data.storage.runtime.param'
import { WindowParam as schemaWinParam } from '@v-act/vjs.framework.extension.platform.data.storage.schema.param'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

//dataInitor;

export function initModule(sb) {}

const setInput = function (params) {
  let c = params.code,
    value = params.value
  windowParam.setInput(c, value)
}

const getInput = function (params) {
  let code = params.code
  if (windowParam.existsInput(code)) {
    return windowParam.getInput(code)
  } else {
    //没有找到输入变量值，则初始化
    let scope = scopeManager.getScope()
    let componentCode = scope.getComponentCode(),
      windowCode = scope.getWindowCode()
    let define = schemaWinParam.getInputDefine(componentCode, windowCode, code)
    if (define) {
      /*var val = dataInitor.init({
                code : define.getCode(),
                type : define.getType(),
                value : define.geInitValue(),
                configs : define.getConfigs()
            });*/
      let val = define.getInitValue()
      windowParam.setInput(code, val)
      return val
    } else {
      return null
      //throw new Error("[WindowParam.getInput]未找到窗体输入变量定义,请检查!构件编号："+componetCode+",窗体编号："+windowCode+",输入变量编号："+code);
    }
  }
}

const getInputs = function () {
  let result = {}
  let scope = scopeManager.getWindowScope()
  let componentCode = scope.getComponentCode(),
    windowCode = scope.getWindowCode()
  let defines = schemaWinParam.getInputDefines(componentCode, windowCode)
  if (defines) {
    for (let i = 0, len = defines.length; i < len; i++) {
      let define = defines[i]
      let code = define.getCode()
      let val = getInput({ code: code })
      result[code] = val
    }
  }
  let inputs = windowParam.getInputs()
  if (inputs) {
    for (let key in inputs) {
      if (inputs.hasOwnProperty(key)) {
        result[key] = inputs[key]
      }
    }
  }
  return result
}

const getInputDefine = function (params) {
  let code = params.code
  let scope = scopeManager.getWindowScope()
  let componentCode = scope.getComponentCode(),
    windowCode = scope.getWindowCode()
  return schemaWinParam.getInputDefine(componentCode, windowCode, code)
}

const setOutput = function (params) {
  let scope = scopeManager.getChildWindowScope()
  if (!scope) {
    scope = scopeManager.getScope()
  }
  return scopeManager.createScopeHandler({
    scopeId: scope.getInstanceId(),
    handler: function () {
      var code = params.code,
        value = params.value
      windowParam.setOutput(code, value)
    }
  })()
}

const getOutput = function (params) {
  let scope = scopeManager.getChildWindowScope()
  if (!scope) {
    scope = scopeManager.getScope()
  }
  return scopeManager.createScopeHandler({
    scopeId: scope.getInstanceId(),
    handler: function () {
      var code = params.code
      if (windowParam.existsOutput(code)) {
        return windowParam.getOutput(code)
      } else {
        //没有找到输入变量值，则初始化
        var componentCode = scope.getComponentCode(),
          windowCode = scope.getWindowCode()
        var define = schemaWinParam.getOutputDefine(
          componentCode,
          windowCode,
          code
        )
        if (define) {
          /*var val = dataInitor.init({
                    code : define.getCode(),
                    type : define.getType(),
                    value : define.geInitValue(),
                    configs : define.getConfigs()
                });*/
          var val = define.getInitValue()
          windowParam.setOutput(code, val)
          return val
        } else {
          return null
          //throw new Error("[WindowParam.getOutput]未找到窗体输出变量定义,请检查!构件编号："+componetCode+",窗体编号："+windowCode+",输出变量编号："+code);
        }
      }
    }
  })()
}

const getOutputDefine = function (params) {
  let code = params.code
  let scope = scopeManager.getWindowScope()
  let componentCode = scope.getComponentCode(),
    windowCode = scope.getWindowCode()
  return schemaWinParam.getOutputDefine(componentCode, windowCode, code)
}

const getOutputs = function () {
  let result = {}
  let scope = scopeManager.getWindowScope()
  let componentCode = scope.getComponentCode(),
    windowCode = scope.getWindowCode()
  let defines = schemaWinParam.getOutputDefines(componentCode, windowCode)
  if (defines) {
    for (let i = 0, len = defines.length; i < len; i++) {
      let define = defines[i]
      let code = define.getCode()
      let val = getOutput({ code: code })
      result[code] = val
    }
  }
  let outputs = windowParam.getOutputs()
  if (outputs) {
    for (let key in outputs) {
      if (outputs.hasOwnProperty(key)) {
        result[key] = outputs[key]
      }
    }
  }
  return result
}

const addInputDefines = function (componentCode, windowCode, defines) {
  schemaWinParam.addInputDefines(componentCode, windowCode, defines)
}

const addOutputDefines = function (componentCode, windowCode, defines) {
  schemaWinParam.addOutputDefines(componentCode, windowCode, defines)
}

const getOutputDefines = function (componentCode, windowCode) {
  return schemaWinParam.getOutputDefines(componentCode, windowCode)
}

const getInputDefines = function (componentCode, windowCode) {
  return schemaWinParam.getInputDefines(componentCode, windowCode)
}

export {
  addInputDefines,
  addOutputDefines,
  getInput,
  getInputDefine,
  getInputDefines,
  getInputs,
  getMetadata,
  getOption,
  getOutput,
  getOutputDefine,
  getOutputDefines,
  getOutputs,
  getRuleSetInputs,
  getVariant,
  initVariant,
  refreshVariant,
  setInput,
  setOutput,
  setVariant,
  setVariants
}
